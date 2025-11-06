import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

const connectDB = async () => {
  try {
    // If already connected, return the existing connection
    if (mongoose.connection.readyState >= 1) {
      console.log('Already connected to MongoDB')
      return mongoose.connection
    }

    const mongoURI = process.env.NODE_ENV === "test" ? process.env.MONGODB_TEST_URI : process.env.MONGODB_URI

    const conn = await mongoose.connect(mongoURI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    })

    console.log(`MongoDB Connected: ${conn.connection.host}`)
    return conn
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB
