const express = require("express");
const { MongoClient } = require("mongodb");
const router = require("./routers");

const url = "mongodb://localhost:27017";
const dbName = "webShop";
// const dbName = "mindx_web_55";
const dbClient = new MongoClient(url);

dbClient.connect(async (err, client) => {
   console.log("DB Connected");
   const db = client.db(dbName);
   // const result = await db.collection("inventory").find({'instock.1.qty':15}).toArray()
   // const result = await db.collection("inventory").find().sort({ "instock.qty": -1 }).limit(4).toArray();
   // console.log(`  *** result`, result);
   // db.collection("users").insertOne({
   //    username: "vuongcdt",
   //    password: "123456",
   // });
   // client.close()
});

const app = express();
app.use(express.json());

app.use(router);

app.get("/", (req, res) => {
   res.send("sever is runing");
});

// app.use((err, req, res, next) => {
//    if (err) {
//       // console.log("ERROR", err);
//       fs.writeFile(path.resolve(__dirname, "err.txt"), JSON.stringify(err.number), (err) => console.log("err FS", err));
//       res.send("loi roi  " + err.number);
//    } else {
//       next();
//    }
// });

const port = process.env.PORT || 5001;
app.listen(port, () => {
   console.log(`Sever is runing at port ${port}`);
});
