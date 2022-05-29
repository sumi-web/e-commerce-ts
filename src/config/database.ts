import mongoose from 'mongoose';

const connectMongoDb = () => {
  mongoose
    .connect(process.env.LOCAL_DB_URL)
    .then((data) => console.log(`mongoDb connected with ${data.connection.host}`));
};

export default connectMongoDb;
