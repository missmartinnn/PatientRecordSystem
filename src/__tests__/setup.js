import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import { beforeAll, afterEach, afterAll } from "@jest/globals"
import connectDB from "../config/database.js"

let mongoServer

// Setup test database connection
beforeAll(async () => {
  process.env.NODE_ENV = 'test'
  mongoServer = await MongoMemoryServer.create({
    instance: {
      startupTimeout: 30000, 
    },
  })
  const mongoUri = mongoServer.getUri()
  process.env.MONGODB_TEST_URI = mongoUri
  await connectDB()

  // Ensure connection is ready
  await new Promise((resolve) => {
    if (mongoose.connection.readyState === 1) {
      resolve()
    } else {
      mongoose.connection.once('connected', resolve)
    }
  })
})

// Clear database after each test
afterEach(async () => {
  const collections = mongoose.connection.collections
  for (const key in collections) {
    await collections[key].deleteMany()
  }
})

// Close database connection after all tests
afterAll(async () => {
  await mongoose.connection.close()
  await mongoServer.stop()
})
