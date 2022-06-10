import mongoose from 'mongoose';

const connectMongoDb = () => {
  const dbUrl =
    process.env.NODE_ENV === 'development' ? process.env.LOCAL_DB_URL : process.env.SERVER_DB_URL;
  mongoose
    .connect(dbUrl)
    .then((data) => console.log(`mongoDb connected with ${data.connection.host}`));
};

export default connectMongoDb;
