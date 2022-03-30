import app from './app';
import dotenv from 'dotenv';
import process from 'process';
import connectMongoDb from './config/database';
import { Server } from 'http';

// config .env file
dotenv.config({ path: './src/config/.env' });

// handling uncaught exception -- this should be on top to catch all undefined variables errors
process.on('uncaughtException', (err: Error) => {
  console.log('Error:', err.message);
  console.log('shutting down the server due to Uncaught Exception Error');
  process.exit(1);
});

const port: number | string = process.env.PORT || 5001;

// connecting db
connectMongoDb();

// setting up listener
const server: Server = app.listen(port, (): void => {
  console.log(`server successfully connected on port ${port}`);
});

// handling unhandled promise rejection -- this should be in last
process.on('unhandledRejection', (err: Error) => {
  console.log('Error:', err.message);
  console.log('shutting down the server due to Unhandled Promise Rejection');
  server.close(() => process.exit(1));
});
