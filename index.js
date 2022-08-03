const express = require("express");
const { connnectToDb } = require("./database");
const { editData } = require("./editData");
const router = require("./routers");

const port = process.env.PORT || 5001;
const app = express();

app.use(express.json());

app.use(router);
app.get("/", (req, res) => {
   res.send("sever is runing");
});

// console.log(`  *** editData()`, editData())

app.use((err, req, res, next) => {
   if (err) {
      console.log("ERROR", err);
      // fs.writeFile(path.resolve(__dirname, "err.txt"), JSON.stringify(err.number), (err) => console.log("err FS", err));
      res.send("loi roi  " + err);
   } else {
      next();
   }
});

connnectToDb();

app.listen(port, () => {
   console.log(`Sever is runing at port ${port}`);
});
