import express from "express";
import {esClient, totalNumberOfUsers} from "../config";
import user from "../dao/user";
import {indexUser} from "../search/utils";

const router = new express.Router();

export const asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
};

router.post('/',
  asyncMiddleware(async (req, res) => {
    if (!esClient) {
      return res.json({successful: false, reason: "No elasticsearch client"});
    }

    const first = parseInt(req.body.first) || 0,
      last = parseInt(req.body.last) || totalNumberOfUsers;

    if(last <= first) {
      throw new Error("Invalid parameters");
    }
    req.setTimeout(60*60*1000);
    for (let i = first ; i < last ; i++) {
      const thisUser = await user.getByNumericalId(i);
      await indexUser(thisUser, i);
      if (i%100 === 0 ) {
        console.log(`Indexed id #${i}`);
      }
    }
    return res.json({successful: true, nbProcessed: last-first})
  }),
);

export default router;
