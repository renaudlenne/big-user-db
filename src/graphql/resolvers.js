import faker from "faker/locale/en";
const Hashids = require('hashids/cjs');

const hashids = new Hashids();
const initialSeed = 26;
const initialPageSize = 100000;

export default {
  Query: {
    users(_, {first, after}) {
      const pageSize = first || initialPageSize;
      const firstId = (after && after.startsWith('u.')) ?
        hashids.decode(after.substring(2))[0] + 1 : 0;

      return [...Array(pageSize)].map((_, i) => {
        faker.seed(initialSeed+firstId+i);

        const firstName = faker.name.firstName(),
          lastName = faker.name.lastName();

        return {
          id: `u.${hashids.encode(firstId+i)}`,
          email: faker.internet.email(firstName, lastName),
          firstName,
          lastName,
          phone: faker.phone.phoneNumber(),
          avatar: faker.image.avatar(),
          bitcoinAddress: faker.finance.bitcoinAddress(),
          birthDate: faker.date.past(50, new Date(2020, 2, 1)),
        };
      });
    },
  },
  //TODO updaters
  Mutation: {
    async updateAddress(object, { addressInput }) {
    },
    async updateCompany(object, { companyInput }) {
    },
    async updateJobPosition(object, { jobPositionInput }) {
    },
    async updateUser(object, { userInput }) {
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
      return [...Array(Math.floor(faker.random.number({min: 0, max: 2})))].map((_, i) => ({
        id: `j.${hashids.encode(numericalId*10+i)}`,
        title: faker.name.jobTitle(),
        descriptor: faker.name.jobDescriptor(),
        type: faker.name.jobType(),
        area: faker.name.jobArea(),
        phone: faker.phone.phoneNumber(),
        email: faker.internet.email(object.firstName, object.lastName, faker.internet.domainName()),
        startDate: faker.date.past(3, new Date(2020, 2, 1)),
      }));
    },
    async address(object) {
      const userId = object.id;
      if (!userId || !userId.startsWith('u.')) {
        throw new Error('Incorrect user')
      }
      const numericalId = hashids.decode(userId.substring(2))[0];
      faker.seed(numericalId);

      return {
        id: `a.${hashids.encode(numericalId*10)}`,
        streetAddress: faker.address.streetAddress(),
        secondaryAddress: faker.address.secondaryAddress(),
        zipCode: faker.address.zipCode(),
        city: faker.address.city(),
        country: faker.address.country(),
        latitude: faker.address.latitude(),
        longitude: faker.address.longitude(),
      }
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

      return {
        id: `c.${hashids.encode(numericalId*10)}`,
        name: faker.company.companyName(0),
        description: faker.company.bs(),
        phone: faker.phone.phoneNumber(),
      }
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

      return {
        id: `a.${hashids.encode(numericalId*10)}`,
        streetAddress: faker.address.streetAddress(),
        secondaryAddress: faker.address.secondaryAddress(),
        zipCode: faker.address.zipCode(),
        city: faker.address.city(),
        country: faker.address.country(),
        latitude: faker.address.latitude(),
        longitude: faker.address.longitude(),
      }
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

      return {
        id: `u.${hashids.encode(numericalId*10)}`,
        email: faker.internet.email(firstName, lastName),
        firstName,
        lastName,
        phone: faker.phone.phoneNumber(),
        avatar: faker.image.avatar(),
        bitcoinAddress: faker.finance.bitcoinAddress(),
        birthDate: faker.date.past(50, new Date(2020, 2, 1)),
      };
    },
  }
}
