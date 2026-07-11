import {app} from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/Db.js";
dotenv.config({
  path: "./.env"
});

const port = process.env.PORT;

connectDB()
.then(()=>{
  const server = app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
  })
}
)

.catch((err)=> {
  console.error("Error starting server:", err);
})