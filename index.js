require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { connectToDb } = require("./database");
const { editData } = require("./editData");
const router = require("./routers");
const { wakeUp } = require("./wake-up/wakeUp");

console.log("process.env.PORT:", process.env.PORT, process.env.MONGODB_URI);
const port = process.env.PORT || 5001;

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api", router);

app.get("/", (req, res) => {
   wakeUp();
   res.send("sever is runing: "+ process.env.MONGODB_URI);
});

// console.log(`  *** editData()`, editData())
// ?directConnection=true


app.use((err, req, res, next) => {
   if (err) {
      console.log("ERROR", err);
      res.send("error " + err);
   } else {
      next();
   }
});

connectToDb(process.env.MONGODB_URI);
// wakeUp();

app.listen(port, () => {
   console.log(`Sever is runing at port ${port}`);
});
