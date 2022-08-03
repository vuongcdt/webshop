const { ObjectId } = require("mongodb");
const { db } = require(".");

const findUserByEmailDb = async (email) => {
   return await db.users.findOne({ email });
};

const findUserByIdDb = async (_id) => {
   return await db.users.findOne({ _id: ObjectId(_id) });
};

const findByAllUsers = async ({ per_page = 10, page = 1 }) => {
   const total_users = await db.users.countDocuments({});
   const list_users = await db.users
      .find({})
      .skip(+per_page * (+page - 1))
      .limit(+per_page)
      .toArray();
   return { total_users, list_users, per_page, page };
};

const insertUser = async (user) => {
   return await db.users.insertOne(user);
};

module.exports = { findUserByEmailDb, insertUser, findUserByIdDb, findByAllUsers };
