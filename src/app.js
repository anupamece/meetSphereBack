import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app =  express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, "../../frontEnd/dist");
const clientIndexPath = path.join(clientDistPath, "index.html");

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

if (fs.existsSync(clientIndexPath)) {
  app.use(express.static(clientDistPath));

  app.get(/^\/(?!api\/).*/, (req, res) => {
    res.sendFile(clientIndexPath);
  });
}

export {app};
