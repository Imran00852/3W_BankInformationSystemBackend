import express from "express";
import { config } from "dotenv";
import { connectDB } from "./config/connectDB.js";
import userRouter from "./routes/userRoutes.js";
import bankingRouter from "./routes/bankRoutes.js";
import adminRouter from "./routes/adminRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
config();
connectDB();

//cors
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: "*",
    credentials: true,
  })
);

//parse json data
app.use(express.json());

//cookie parser
app.use(cookieParser());

//apis
app.use("/api/users", userRouter);
app.use("/api", bankingRouter);
app.use("/api/admin", adminRouter);

//home route
app.get("/", (req, res) => {
  res.send("Home Route");
});

app.listen(process.env.PORT, () => {
  console.log(`server is running on port ${process.env.PORT}`);
});
