const jwt = require("jsonwebtoken");

const loginCtrl = (username) => {
   if (!username) return;
   return jwt.sign(
      {
         username,
      },
      "IsInR5cCI6IkpXVCJ9.eyJ1",
      {
         expiresIn: 45 * 60,
      }
   );
};

const registerCtrl=()=>{
   
}

module.exports = { loginCtrl ,registerCtrl};
