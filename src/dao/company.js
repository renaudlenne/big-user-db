import faker from "faker/locale/en";

import cache from "../cache";
import {hashids, initialSeed} from "../config";
import {checkAndDecodeId} from "./utils";

const numericalIdFromId = (userId) => {
  return checkAndDecodeId(userId, 'c');
};

const getById = async (id) => {
  return getByNumericalId(numericalIdFromId(id));
};

const getByNumericalId = async (numId) => {
  faker.seed(initialSeed+numId);

  const id = `c.${hashids.encode(numId)}`;
  const baseCompany = {
    id,
    name: faker.company.companyName(0),
    description: faker.company.bs(),
    phone: faker.phone.phoneNumber(),
  };

  const updCompany = await cache.get(id) || {};
  return {...baseCompany, ...updCompany};
};

export default {
  getById,
  getByNumericalId,
  numericalIdFromId,
}
