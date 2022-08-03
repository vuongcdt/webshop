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
   db.users = database.collection("users");
   db.products = database.collection("products");
};

module.exports = { db, connnectToDb };