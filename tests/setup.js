require('dotenv').config();
const mongoose = require('mongoose');

// Tests run against a dedicated database on the same Atlas cluster used for
// development, so a full test run never touches dev/manual-testing data and
// can safely wipe itself clean between runs.
const TEST_DB_NAME = 'task_manager_jest';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, { dbName: TEST_DB_NAME });
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const name in collections) {
    await collections[name].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});
