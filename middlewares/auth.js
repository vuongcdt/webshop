const jwt = require("jsonwebtoken");


const authMdw = (req, res, next) => {
   const token = req.headers.authorization.split(" ")[1];
   const result = jwt.verify(token, "IsInR5cCI6IkpXVCJ9.eyJ1", (err, decoded) => {
      if (err) {
         //  console.log("ERROR decoded", err.message);
         res.status(401).send(err.prototype);
         // throw Object.getOwnPropertyNames(err)

      } else {
         console.log("decoded", decoded);
         next();
      }
   });
};

module.exports = { authMdw };
