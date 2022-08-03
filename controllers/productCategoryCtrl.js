const { findAllProductsBySlugDb } = require("../database/productsDb");

const productCategoryCtrl = async (query) => {
   if (query.slug === "" || !query.slug) return { per_page: 1, page: 1, list_products: "hello", total_products: 1, total_page: 1 };

   if (query.order === "desc") {
      query.order = -1;
   } else query.order = 1;

   if (!["date_created", "price", "name", "average_rating", "_id", "regular_price", ""].includes(query.orderby) && query.orderby) {
      throw new Error("Field not correct");
   }

   if (query.orderby === "date" || query.orderby === "") query.orderby = "date_created";
   if (query.per_page > 50) query.per_page = 50;

   const { per_page, page, list_products, total_products, filter } = await findAllProductsBySlugDb(query);
   const total_page = Math.ceil(total_products / per_page);

   if (page > total_page && total_page > 0) throw new Error("Total Page less than page");

   return { per_page, page, list_products, total_products, total_page, filter };
};

module.exports = { productCategoryCtrl };
