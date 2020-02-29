export default {
  Query: {
    users() {
    },
  },
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
    },
    async address(object) {

    },
  },
  JobPosition: {
    async company(object) {
    },
  },
  Company: {
    async address(object) {
    },
    async contact(object) {
    },
  }
}
