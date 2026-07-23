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
import movieRouter from "./routes/movie.routes.js";
import diningRouter from "./routes/dining.routes.js";
import bookingRouter from "./routes/booking.routes.js";

app.use("/api/auth", userRouter);
app.use("/api/events", eventRouter);
app.use("/api/fav", favRouter);
app.use("/api/movies", movieRouter);
app.use("/api/dining", diningRouter);
app.use("/api/booking", bookingRouter);

export {app};
