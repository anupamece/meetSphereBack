import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app =  express();

app.use(cors(
  
));
app.use(cookieParser());
app.use(express.json());

import userRouter from "./routes/user.router.js";
import eventRouter from "./routes/events.routes.js";
import favRouter from "./routes/fav.routes.js";


app.use("/api/auth", userRouter);
app.use("/api/events", eventRouter);
app.use("/api/fav", favRouter);

export {app};
