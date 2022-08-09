const { MongoClient } = require("mongodb");

const dbName = "webshop";
const db = {};
const connectToDb = async (url) => {
   const mongodbClient = new MongoClient(url);
   await mongodbClient.connect();
   console.log("DB Connected");
   const database = mongodbClient.db(dbName);
   db.users = database.collection("users");
   db.products = database.collection("products");
};

module.exports = { db, connectToDb };
