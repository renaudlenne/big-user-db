import faker from "faker/locale/en";

import cache from "../cache";
import {hashids, initialSeed} from "../config";
import {checkAndDecodeId} from "./utils";

const numericalIdFromId = (userId) => {
  return checkAndDecodeId(userId, 'a');
};

const getById = async (id) => {
  return getByNumericalId(numericalIdFromId(id));
};

const getByNumericalId = async (numId) => {
  faker.seed(initialSeed+numId);

  const id = `a.${hashids.encode(numId)}`;
  const baseAddress = {
    id,
    streetAddress: faker.address.streetAddress(),
    secondaryAddress: faker.address.secondaryAddress(),
    zipCode: faker.address.zipCode(),
    city: faker.address.city(),
    country: faker.address.country(),
    latitude: faker.address.latitude(),
    longitude: faker.address.longitude(),
  };

  const updAddress = await cache.get(id) || {};
  return {...baseAddress, ...updAddress};
};

export default {
  getById,
  getByNumericalId,
  numericalIdFromId,
}
