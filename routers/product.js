const express = require("express");
const { productCtrl } = require("../controllers/productCtrl");
const router = express.Router();

router.get("/", async(req, res) => {
   try {
      const { total_page, total_products, per_page, page, product } =await productCtrl(req.query);
      res.set({ total_page, total_products, per_page, page });
      res.json(product);
   } catch (error) {
      console.log(`  *** error get /products ***`, error);
      res.status(400).send(error.message);
   }
});


module.exports = router;
