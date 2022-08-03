const express = require("express");
const { productCategoryCtrl } = require("../controllers/productCategoryCtrl");
const router = express.Router();

router.get("/", async (req, res) => {

   try {
      console.time("time");
      const { total_page, total_products, per_page, page, list_products, filter } = await productCategoryCtrl(req.query);
      res.set({ total_page, total_products, per_page, page });
      console.timeEnd("time");
      res.json({ filter, list_products });
   } catch (error) {
      console.log(`  *** error get /product-category ***`, error);
      res.status(400).send(error.message);
   }
});

module.exports = router;
