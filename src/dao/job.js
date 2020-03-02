import faker from "faker/locale/en";

import cache from "../cache";
import {hashids, initialSeed} from "../config";
import {checkAndDecodeId} from "./utils";
import user from "./user";

const numericalIdFromId = (userId) => {
  return checkAndDecodeId(userId, 'j');
};

const getById = async (id) => {
  return getByNumericalId(numericalIdFromId(id));
};

const getByNumericalId = async (numId, parent) => {
  faker.seed(initialSeed+numId);
  const jobId = `j.${hashids.encode(numId)}`;
  const baseJob = {
    id: jobId,
    title: faker.name.jobTitle(),
    descriptor: faker.name.jobDescriptor(),
    type: faker.name.jobType(),
    area: faker.name.jobArea(),
    phone: faker.phone.phoneNumber(),
    ...(parent ? {email: faker.internet.email(parent.firstName, parent.lastName, faker.internet.domainName())} : {}),
    startDate: faker.date.past(3, new Date(2020, 2, 1)),
  };

  const updJob = await cache.get(jobId) || {};
  return {...baseJob, ...updJob};
};

const getForUser = async (parent) => {
  const userNumId = user.numericalIdFromId(parent.id);
  faker.seed(initialSeed+userNumId);
  return [...Array(Math.floor(faker.random.number({min: 0, max: 2})))].map(async (_, i) => {
    return getByNumericalId(userNumId * 10 + i, parent);
  });
};

export default {
  getById,
  getByNumericalId,
  numericalIdFromId,
  getForUser,
}
