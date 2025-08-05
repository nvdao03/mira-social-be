import { config } from 'dotenv'
import mongoose from 'mongoose'

config()

const URL = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@mira-social.3gugumn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Mira-Social`

class MongoDBConfig {
  async connect() {
    try {
      await mongoose.connect(URL)
      console.log('MongoDB connected successfully')
    } catch (error) {
      console.error('MongoDB connection error:', error)
    }
  }
}

export const mongodbConfig = new MongoDBConfig()
export default mongodbConfig
