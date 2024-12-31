import mongoose from 'mongoose';
import type { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); 


const DB_URI = process.env.MONGODB_URI_TESTING

const connectDB = async (): Promise<void> => {
  try {
   
    if (!DB_URI) {
      throw new Error('Environment variable MONGODB_URI is not defined');
    }

    await mongoose.connect(
      `${DB_URI}`
    );

    // console.log('Database connected');
  } catch (error) {
    console.error('Error while connecting to database:', error);
  }
};

export { connectDB };
