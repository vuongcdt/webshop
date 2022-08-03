const express = require("express");
const jwt = require("jsonwebtoken");
const { loginCtrl, registerCtrl } = require("../controllers/authCtrl");
const { validateMdw } = require("../middlewares/authMdw");

const router = express.Router();

router.post("/login",async (req, res) => {
   try {
      const token =await loginCtrl(req.body.email,req.body.password);
      res.json({token});
   } catch (error) {
      console.log(`*** error login ***`, error);
      res.status(401).send(error.message);
   }
});

router.post("/register", validateMdw, async (req, res) => {
   try {
      if (!req.body.password || req.body.password.length < 8) {
         res.status(400).send("Password must contain at least 8 characters");
         return;
      }
      const result = await registerCtrl(req.body.email, req.body.password);
      res.json({ infoUser: { _id: result.insertedId, email: req.body.email } });
   } catch (error) {
      console.log(`*** error register ***`, error);
      res.status(401).send(error.message);
   }
});

module.exports = router;
