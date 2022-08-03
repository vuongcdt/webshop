const jwt = require("jsonwebtoken");
const validator = require("validator");
const { findUserByIdDb } = require("../database/userDb");

const authMdw = (req, res, next) => {
   const bearerToken = req.headers.authorization;
   if (!bearerToken) {
      res.status(401).send("Missing JWT token");
      return;
   }
   const token = req.headers.authorization.split(" ")[1];
   jwt.verify(token, "IsInR5cCI6IkpXVCJ9.eyJ1", async (err, decoded) => {
      if (err) {
         res.status(401).send("Invalid token");
      } else {
         const user = await findUserByIdDb(decoded.userId);
         if (!user) res.status(401).send("User existed");
         req.user = user;
         next();
      }
   });
};

const requireAdminMdw = (req, res, next) => {
   if (!req.user.isAdmin) {
      res.json(req.user);
   } else next();
};

const validateMdw = (req, res, next) => {
   const { email, password } = req.body;
   const validateEmail = validator.isEmail(email, { allow_utf8_local_part: false });
   if (!validateEmail) throw new Error("Invalid Email");
   if (!validatePassword(password)) throw new Error("Invalid Password");
   next();
};

const validateEmailRegex = (email) => {
   return String(email)
      .toLowerCase()
      .match(
         /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
};
const validatePassword = (str) => {
   const regex = /^(?=\S*[a-z]|\d)(?=\S*[A-Z])(?=\S*[^\w\s])\S{8,}$/;
   return regex.test(str);
};

module.exports = { authMdw, validateMdw, requireAdminMdw };
