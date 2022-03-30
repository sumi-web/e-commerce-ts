import express, { Application } from "express";
import { errorMiddleWare } from "./middlewares/error";

//route imports
import { router as productRoute } from "./routes/productRoute";

// init app
const app: Application = express();

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//setting up routing middleware
app.use("/api", productRoute);

// middleware for errors
app.use(errorMiddleWare);

app.use("*", (_, res) => {
	res.status(404).send("page not found");
});

export default app;
