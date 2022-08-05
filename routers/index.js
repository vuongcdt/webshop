const express = require("express");
const { authMdw, requireAdminMdw } = require("../middlewares/authMdw");
const authRouter = require("./auth");
const userRouter = require("./user");
const crawlRouter = require("./crawl");
const productRouter = require("./product");
const searchProductRouter = require("./searchProduct");
const productCategoryRouter = require("./productCategory");
const searchRouter = require("./search");

const router = express.Router();

router.use("/auth", authRouter);
router.use("/user", authMdw, requireAdminMdw, userRouter);
router.use("/product/", productRouter);
router.use("/search-product/", searchProductRouter);
router.use("/search/", searchRouter);
router.use("/product-category", productCategoryRouter);
router.use("/crawl", crawlRouter);

// router.post('/auth/login',(req,res)=>{
//     console.log('req.body.username',req.body.username);
//     res.send('ok')
// })

module.exports = router;
