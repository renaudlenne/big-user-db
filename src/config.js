import elasticsearch from "@elastic/elasticsearch";
import faker from "faker/locale/en";
const Hashids = require('hashids/cjs');

export const initialSeed = 26;
faker.seed(initialSeed);
export const totalNumberOfUsers = faker.random.number({min: 70000000, max: 120000000});
export const hashids = new Hashids();

const connectionString = process.env.SEARCHBOX_URL;
export const esClient = connectionString ? new elasticsearch.Client({ node: connectionString }) : undefined;