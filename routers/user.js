const express = require("express");
const { userCtrl } = require("../controllers/userCtrl");
const router = express.Router();

router.get("/", async (req, res) => {
   try {
      const { total_users, per_page, total_pages, list_users ,page} = await userCtrl(req.query);
      res.set({ total_users, per_page, total_pages ,page});
      res.json(list_users);
   } catch (error) {
      console.log(`  *** error user ***`, error);
      res.status(401).send(error.message);
   }
});

module.exports = router;
