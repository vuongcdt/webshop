const express = require("express");
const { productsFilterCtrl } = require("../controllers/productsFilterCtrl");
const router = express.Router();

router.get("/", async (req, res) => {
   try {
      const { total_page, total_products, per_page, page, list_products, filterSidebar } = await productsFilterCtrl(req.query);
      res.set({ total_page, total_products, per_page, page });
      res.json({ _totals:total_products,filterSidebar, list_products });
   } catch (error) {
      console.log(`  *** error get /search-product ***`, error);
      res.status(400).send(error.message);
   }
});

module.exports = router;
