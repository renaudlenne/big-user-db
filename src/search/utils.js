import {esClient} from "../config";

export const indexUser = async (user, numericalId) => {
  return esClient.index({
    index: 'users',
    id: numericalId,
    body: {n: `${user.firstName} ${user.lastName}`, i: numericalId},
  });
};
