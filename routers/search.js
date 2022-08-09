const express = require("express");
const { searchCtrl } = require("../controllers/searchCtrl");
const router = express.Router();

router.get("/", async (req, res) => {
   try {
    console.time('search')
    const { list_products, _total } = await searchCtrl(req.query.key);
    console.timeEnd('search')
      res.json({  _total,list_products});
   } catch (error) {
      console.log(`  *** error /search`, error);
   }
});

module.exports = router;
