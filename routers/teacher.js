const express = require("express");
const jwt = require("jsonwebtoken");
const { authMdw } = require("../middlewares/auth");
const router = express.Router();

router.get("/",authMdw, (req, res) => {
    // authMdw(req.headers.authorization)
   res.send("ok teacher");
});

module.exports = router;
