const express = require("express");
const { productsFilterCtrl } = require("../controllers/productsFilterCtrl");
const router = express.Router();

router.get("/", async (req, res) => {
   try {
      req.query.isCategory=true
      const { total_page, total_products, per_page, page, list_products, filterSidebar } = await productsFilterCtrl(req.query);
      res.set({ total_page, total_products, per_page, page });
      res.json({_total:total_products,list_products ,filterSidebar});
   } catch (error) {
      console.log(`  *** error get /product-category ***`, error);
      res.status(400).send(error.message);
   }
});

module.exports = router;
