require("dotenv").config();
const { MongoClient } = require("mongodb");

const url=process.env.URL_MONGODB
const dbName = "webShop";
const db = {};
const connectToDb = async () => {
   const mongodbClient = new MongoClient(url);
   await mongodbClient.connect();
   console.log("DB Connected");
   const database = mongodbClient.db(dbName);
   db.users = database.collection("users");
   db.products = database.collection("products");
};

module.exports = { db, connectToDb };
