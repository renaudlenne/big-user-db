import {esClient, hashids, totalNumberOfUsers} from '../config';
import cache from '../cache';
import address from '../dao/address';
import company from '../dao/company';
import job from '../dao/job';
import user from '../dao/user';
import {indexUser} from "../search/utils";

export default {
  Query: {
    async users(_, {first, after, matching}) {
      const pageSize = first || totalNumberOfUsers;
      const firstId = (after && after.startsWith('u.')) ?
        hashids.decode(after.substring(2))[0] + 1 : 0;

      if (matching) {
        const esResult = await esClient.search({
          index: 'users',
          size: pageSize,
          sort: "i:asc",
          body: {
            query: {
              bool: {
                must: {
                  match: {
                    n: {
                      query: matching,
                    }
                  }
                },
                ...(firstId ? {
                  must_not: {
                    range: {
                      i: {
                        gt: firstId,
                      }
                    }
                  }
                } : {})
              }
            },
          }
        });
        return esResult.body.hits.hits.map(u => {
          return user.getByNumericalId(u.id);
        });
      } else {
        return [...Array(pageSize)].map(async (_, i) => {
          const numericalId = firstId + i;
          return user.getByNumericalId(numericalId);
        });
      }
    },
  },

  Mutation: {
    async updateAddress(object, { addressInput }) {
      const addressId = addressInput.id;
      if (!addressId || !addressId.startsWith('a.')) {
        throw new Error('Incorrect address')
      }
      await cache.set(addressId, addressInput);
      return address.getById(addressId);
    },
    async updateCompany(object, { companyInput }) {
      const companyId = companyInput.id;
      if (!companyId || !companyId.startsWith('c.')) {
        throw new Error('Incorrect company')
      }
      await cache.set(companyId, companyInput);
      return company.getById(companyId);
    },
    async updateJobPosition(object, { jobPositionInput }) {
      const jobId = jobPositionInput.id;
      if (!jobId || !jobId.startsWith('j.')) {
        throw new Error('Incorrect job')
      }
      await cache.set(jobId, jobPositionInput);
      return job.getById(jobId);
    },
    async updateUser(object, { userInput }) {
      const userId = userInput.id;
      if (!userId || !userId.startsWith('u.')) {
        throw new Error('Incorrect user')
      }
      await cache.set(userId, userInput);
      const newUser = user.getById(userId);
      await indexUser(newUser, user.numericalIdFromId(userId));
      return newUser;
    },
  },
  User: {
    async jobs(object) {
      return job.getForUser(object);
    },
    async address(object) {
      const userNumericalId = user.numericalIdFromId(object.id);
      return address.getByNumericalId(userNumericalId*10);
    },
  },
  JobPosition: {
    async company(object) {
      const jobNumbericalId = job.numericalIdFromId(object.id);
      return company.getByNumericalId(jobNumbericalId*10);
    },
  },
  Company: {
    async address(object) {
      const companyNumericalId = company.numericalIdFromId(object.id);
      return address.getByNumericalId(companyNumericalId*10);
    },
    async contact(object) {
      const companyNumericalId = company.numericalIdFromId(object.id);
      return user.getByNumericalId(companyNumericalId*10);
    },
  }
}
