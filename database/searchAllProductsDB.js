const { db } = require(".");

const searchAllProductsDb = async (key) => {
   console.log(`  *** key`, key);
   const result = await db.products.createIndex({ key_search: "text"});
   console.log(`  *** result`, result);
   const filter = {
      $text: { $search: key.replace("_", " ") },
      // key_search: { $regex: key.replace("_", " ") },
      // key_search: { $all: [{ $regex: key.replace("_", " ") }, { $regex: "men" }] },
      // {$and:[{price:{$lt:30}},{price:{$gt:20}}]}
      // "band.slug": { $regex: key }
      // key_search: new RegExp(key.replace("_", " "), "ig"),
   };
   return {
      list_products: await db.products
         .find(filter)
         .limit(50)
         .map(({ key_search }) => key_search)
         .toArray(),
      _total: await db.products.countDocuments(filter),
   };
};

module.exports = { searchAllProductsDb };
