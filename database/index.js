require("dotenv").config();
const { MongoClient } = require("mongodb");

console.log("process.env.URL_MONGODB:", process.env.URL_MONGODB);
// const url = process.env.URL_MONGODB;
const url = 'mongodb+srv://admin:admin123@cluster0.yy8pv.mongodb.net/test'
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
