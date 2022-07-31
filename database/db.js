const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017";
const dbName = "webShop";
// const dbName = "mindx_web_55";
const db = {};
const connnectToDb = async () => {
   const mongodbClient = new MongoClient(url);
   await mongodbClient.connect();
   console.log("DB Connected");
   const database = mongodbClient.db(dbName);
   // const result = await db.collection("inventory").find({'instock.1.qty':15}).toArray()
   // const result = await db.collection("inventory").find().sort({ "instock.qty": -1 }).limit(4).toArray();
   // console.log(`  *** result`, result);
   // db.collection("users").insertOne({
   //    username: "vuongcdt",
   //    password: "123456",
   // });
   // client.close()
};

module.exports = { db, connnectToDb };
