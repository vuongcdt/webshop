const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { findUserByEmailDb, insertUser } = require("../database/userDb");

const loginCtrl = async (email, password) => {
   const existedUser = await findUserByEmailDb(email);
   if (!existedUser) throw new Error("Email is not existed");
   const { hashedPassword } = encryptPassword(password, existedUser.salt);
   if (hashedPassword !== existedUser.hashedPassword) throw new Error("Password not correct");
   
   return jwt.sign(
      {
         userId:existedUser._id,
      },
      "IsInR5cCI6IkpXVCJ9.eyJ1",
      {
         expiresIn: 45 * 60,
      }
   );
};
 
const registerCtrl = async (email, password) => {
   const existedUser = await findUserByEmailDb(email);
   if (existedUser) {
      throw new Error("Email is existed!");
   }
   const { salt, hashedPassword } = encryptPassword(password);
   return insertUser({
      email,
      salt,
      hashedPassword,
      dateCreate: new Date(),
   });
};

const encryptPassword = (password, saltDB) => {
   const salt = saltDB || crypto.randomBytes(64).toString("hex");
   const hashedPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
   return { salt, hashedPassword }; 
};
 
module.exports = { loginCtrl, registerCtrl };
