const express = require("express");
const jwt = require("jsonwebtoken");
const { loginCtrl } = require("../controllers/authCtrl");

const router = express.Router();

router.post("/login", (req, res) => {
   try {
      const token = loginCtrl(req.body.usernames);
      res.send(token);
   } catch (error) {
      res.status(401).json(error);
   }
});

router.post("/register", (req, res) => {
   try {
      console.log(`  ~ req`, req.body);
      res.send("ok resgister");
      
   } catch (error) {
      res.status(401).json(error);
   }
});

module.exports = router;
