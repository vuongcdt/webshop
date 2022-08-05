const { findOneProductBySlugDb } = require("../database/productsDb");

const productCtrl = async ( slug ) => {
   const product = await findOneProductBySlugDb({ slug });

   return { per_page: 1, page: 1, product, total_products: 1, total_page: 1 };
};

module.exports = { productCtrl };
