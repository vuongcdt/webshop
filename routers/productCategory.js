const express = require("express");
const { productCategoryCtrl } = require("../controllers/productCategoryCtrl");
const router = express.Router();

router.get("/", async(req, res) => {
   try {
      const { total_page, total_products, per_page, page, list_products } =await productCategoryCtrl(req.query);
      res.set({ total_page, total_products, per_page, page });
      res.json(list_products);
   } catch (error) {
      console.log(`  *** error get /product-category ***`, error);
      res.status(400).send(error.message);
   }
});

module.exports = router;
