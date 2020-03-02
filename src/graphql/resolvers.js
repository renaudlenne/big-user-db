import faker from "faker/locale/en";
import cache from '../cache';
const Hashids = require('hashids/cjs');

const hashids = new Hashids();
const initialSeed = 26;
const initialPageSize = 100000;

export default {
  Query: {
    async users(_, {first, after}) {
      const pageSize = first || initialPageSize;
      const firstId = (after && after.startsWith('u.')) ?
        hashids.decode(after.substring(2))[0] + 1 : 0;

      return [...Array(pageSize)].map(async (_, i) => {
        faker.seed(initialSeed+firstId+i);

        const firstName = faker.name.firstName(),
          lastName = faker.name.lastName();

        const userId = `u.${hashids.encode(firstId+i)}`;
        const baseUser = {
          id: userId,
          email: faker.internet.email(firstName, lastName),
          firstName,
          lastName,
          phone: faker.phone.phoneNumber(),
          avatar: faker.image.avatar(),
          bitcoinAddress: faker.finance.bitcoinAddress(),
          birthDate: faker.date.past(50, new Date(2020, 2, 1)),
        };

        const updUser = await cache.get(userId) || {};
        return {...baseUser, ...updUser};
      });
    },
  },

  Mutation: {
    async updateAddress(object, { addressInput }) {
      await cache.set(addressInput.id, addressInput);
      return addressInput;
    },
    async updateCompany(object, { companyInput }) {
      await cache.set(companyInput.id, companyInput);
      return companyInput;
    },
    async updateJobPosition(object, { jobPositionInput }) {
      await cache.set(jobPositionInput.id, jobPositionInput);
      return jobPositionInput;
    },
    async updateUser(object, { userInput }) {
      await cache.set(userInput.id, userInput);
      return userInput;
    },
  },
  User: {
    async jobs(object) {
      const userId = object.id;
      if (!userId || !userId.startsWith('u.')) {
        throw new Error('Incorrect user')
      }
      const numericalId = hashids.decode(userId.substring(2))[0];
      faker.seed(numericalId);
      return [...Array(Math.floor(faker.random.number({min: 0, max: 2})))].map(async (_, i) => {
        const jobId = `j.${hashids.encode(numericalId * 10 + i)}`;
        const baseJob = {
          id: jobId,
          title: faker.name.jobTitle(),
          descriptor: faker.name.jobDescriptor(),
          type: faker.name.jobType(),
          area: faker.name.jobArea(),
          phone: faker.phone.phoneNumber(),
          email: faker.internet.email(object.firstName, object.lastName, faker.internet.domainName()),
          startDate: faker.date.past(3, new Date(2020, 2, 1)),
        };

        const updJob = await cache.get(jobId) || {};
        return {...baseJob, ...updJob};
      });
    },
    async address(object) {
      const userId = object.id;
      if (!userId || !userId.startsWith('u.')) {
        throw new Error('Incorrect user')
      }
      const numericalId = hashids.decode(userId.substring(2))[0];
      faker.seed(numericalId);

      const id = `a.${hashids.encode(numericalId*10)}`;
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
    },
  },
  JobPosition: {
    async company(object) {
      const jobId = object.id;
      if (!jobId || !jobId.startsWith('j.')) {
        throw new Error('Incorrect job')
      }
      const numericalId = hashids.decode(jobId.substring(2))[0];
      faker.seed(numericalId);

      const id = `c.${hashids.encode(numericalId*10)}`;

      const baseCpy = {
        id,
        name: faker.company.companyName(0),
        description: faker.company.bs(),
        phone: faker.phone.phoneNumber(),
      };

      const updCpy = await cache.get(id) || {};
      return {...baseCpy, ...updCpy};
    },
  },
  Company: {
    async address(object) {
      const companyId = object.id;
      if (!companyId || !companyId.startsWith('c.')) {
        throw new Error('Incorrect company')
      }
      const numericalId = hashids.decode(companyId.substring(2))[0];
      faker.seed(numericalId);

      const id = `a.${hashids.encode(numericalId*10)}`;
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
    },
    async contact(object) {
      const companyId = object.id;
      if (!companyId || !companyId.startsWith('c.')) {
        throw new Error('Incorrect company')
      }
      const numericalId = hashids.decode(companyId.substring(2))[0];
      faker.seed(numericalId);

      const firstName = faker.name.firstName(),
        lastName = faker.name.lastName();

      const id = `u.${hashids.encode(numericalId*10)}`;
      const baseUser = {
        id,
        email: faker.internet.email(firstName, lastName),
        firstName,
        lastName,
        phone: faker.phone.phoneNumber(),
        avatar: faker.image.avatar(),
        bitcoinAddress: faker.finance.bitcoinAddress(),
        birthDate: faker.date.past(50, new Date(2020, 2, 1)),
      };

      const updUser= await cache.get(id) || {};
      return {...baseUser, ...updUser};
    },
  }
}
