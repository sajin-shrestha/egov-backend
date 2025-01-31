import mongoose from 'mongoose'
import { config } from './config'

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => {
      console.log('Connected to MongoDB successfully')
    })

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err)
    })

    await mongoose.connect(config.databaseUrl as string)
  } catch (err) {
    console.error('Error connecting to MongoDB:', err)
    process.exit(1)
  }
}

export default connectDB
