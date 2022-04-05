import faker from "faker/locale/en";

import cache from "../cache";
import {hashids, initialSeed} from "../config";
import {checkAndDecodeId} from "./utils";

const numericalIdFromId = (userId) => {
  return checkAndDecodeId(userId, 'u');
};

const getById = async (id) => {
  return getByNumericalId(numericalIdFromId(id));
};

const getByNumericalId = async (numId) => {
  faker.seed(initialSeed+numId);

  const firstName = faker.name.firstName(),
    lastName = faker.name.lastName();

  const userId = `u.${hashids.encode(numId)}`;
  const baseUser = {
    id: userId,
    email: faker.internet.email(firstName, lastName),
    firstName,
    lastName,
    phone: faker.phone.phoneNumber(),
    avatar: `https://i.pravatar.cc/300?u=${userId}`,
    bitcoinAddress: faker.finance.bitcoinAddress(),
    birthDate: faker.date.past(50, new Date(2020, 2, 1)),
  };

  const updUser = await cache.get(userId) || {};
  return {...baseUser, ...updUser};
};

export default {
  getById,
  getByNumericalId,
  numericalIdFromId,
}
