const express = require("express");
const { productCtrl ,productsFilterCtrl} = require("../controllers/productCtrl");
const router = express.Router();

router.get("/:slug", async(req, res) => {
   try {
      const { total_page, total_products, per_page, page, product } =await productCtrl(req.params.slug);
      res.set({ total_page, total_products, per_page, page });
      res.json(product);
   } catch (error) {
      console.log(`  *** error get /products ***`, error);
      res.status(400).send(error.message);
   } 
});

router.get("/", async (req, res) => {
   try {
      req.query.isCategory=true
      const { total_page, total_products, per_page, page, list_products, filterSidebar } = await productsFilterCtrl(req.query);
      res.set({ total_page, total_products, per_page, page });
      // res.json({_total:total_products,list_products:list_products.map(({slug})=>slug)});
      res.json({_total:total_products,list_products,filterSidebar});
   } catch (error) {
      console.log(`  *** error get /product search ***`, error);
      res.status(400).send(error.message);   
   }
}); 


module.exports = router;
