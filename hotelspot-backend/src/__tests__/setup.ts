import mongoose from "mongoose";
import { connectDatabase } from "../database/mongodb";

// before all test starts
beforeAll(async () => {
  // can connect new database for testing,
  // or use the same database as development
  await connectDatabase();
});

afterAll(async () => {
  // close database connection after all tests
  await mongoose.connection.close();
});
