const express = require("express");
const { connectToDb } = require("./database");
const { editData } = require("./editData");
const router = require("./routers");

console.log("process.env.PORT:", process.env.PORT, process.env.MONGODB_URI);
const port = process.env.PORT || 3001;

const app = express();

app.use(express.json());

app.use("/api", router);

app.get("/", async (req, res) => {
   res.send("sever is runing");
});

// console.log(`  *** editData()`, editData())

// app.use((err, req, res, next) => {
//    if (err) {
//       console.log("ERROR", err);
//       res.send("error  " + err);
//    } else {
//       next();
//    }
// });

connectToDb(process.env.MONGODB_URI);

app.listen(port, () => {
   console.log(`Sever is runing at port ${port}`);
});
