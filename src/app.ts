import express, { Application } from 'express';
import { errorMiddleWare } from './middlewares/error';
import cookieParser from 'cookie-parser';

//route imports
import { router as productRoute } from './routes/productRoute';
import { router as userRoute } from './routes/userRoute';
import { router as orderRoute } from './routes/orderRoute';

// init app
const app: Application = express();

// parsing Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

//setting up routing middleware
app.use('/api/v1', productRoute);
app.use('/api/v1', userRoute);
app.use('/api/v1/', orderRoute);

// middleware for errors
app.use(errorMiddleWare);

app.use('*', (_, res) => {
  res.status(404).send('page not found');
});

export default app;
