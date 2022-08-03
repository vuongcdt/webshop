const { db } = require(".");

const findAllProductsBySlugDb = async ({ per_page = 10, page = 1, order = 1, orderby = "date_created", slug, pa_color, pa_brand, range_price }) => {
   const filter = {};
   if (slug) filter["categories.slug"] = slug;
   if (pa_color) filter["attributes.color.slug"] = pa_color;
   if (pa_brand) filter["attributes.brand.slug"] = pa_brand;
   if (range_price) {
      const range = range_price.split(":");
      filter.price = { $gt: +range[0], $lt: +range[1] };
   }
   console.time("time2");

   console.time("time");
   const total_products = await db.products.countDocuments(filter);
   const list_products = await db.products
      .find(filter)
      .sort({ [orderby]: order })
      .skip(+per_page * (+page - 1))
      .limit(+per_page)
      .toArray();

   const temp = await db.products
      .aggregate([
         {
            $match: {
               "categories.slug": "women",
            },
         },
         {
            $set: {
               brand: "$attributes.brand",
               color: "$attributes.color",
            },
         },
         {
            $facet: {
               list_products:[{$addFields:{document: "$$ROOT"}}],
               brand: [{ $sortByCount: "$brand" }],
               color: [{ $unwind: "$color" }, { $sortByCount: "$color" }],
               categories: [{ $unwind: "$categories" }, { $sortByCount: "$categories" }],
               price: [
                  {
                     $group: { _id: null, max: { $max: "$price" }, min: { $min: "$price" } },
                  },
               ],
               rating: [{ $sortByCount: "$rating" }],
               discount: [{ $sortByCount: "$discount" }],
            },
         },
      ])
      .toArray();
   // console.log(`  *** temp`, temp);
   console.timeEnd("time");


   const list_all_products = await db.products.find(filter).toArray();
   const listPriceProduct = list_all_products.map((product) => product.price).sort((a, b) => a - b);
   const price_count = { min: listPriceProduct[0], max: listPriceProduct.pop() };
   // console.log(`  *** price_count`, price_count)

   const listBrandProduct = list_all_products.map((product) => product.attributes.brand.slug);
   const brand_count = [...new Set(listBrandProduct)].map((brand) => {
      return { slug: brand, count: listBrandProduct.filter((item) => item === brand).length };
   });
   // console.log(`  *** brand_count`, brand_count);

   const listColorProduct = list_all_products.map((product) => product.attributes.color.map((item) => item.slug)).flat(1);
   const color_count = [...new Set(listColorProduct)].map((color) => {
      return { slug: color, count: listColorProduct.filter((item) => item === color).length };
   });
   // console.log(`  *** color_count`, color_count)

   const listRatingProduct = list_all_products.map((product) => product.rating);
   const rating_count = [...new Set(listRatingProduct)].map((rating) => {
      return { slug: rating, count: listRatingProduct.filter((item) => item === rating).length };
   });
   // console.log(`  *** rating_count`, rating_count)

   const listDiscountProduct = list_all_products.map((product) => product.discount);
   const discount_count = [...new Set(listDiscountProduct)].map((discount) => {
      return { slug: discount, count: listDiscountProduct.filter((item) => item === discount).length };
   });
   // console.log(`  *** discount_count`, discount_count)

   const listCategoriesProduct = list_all_products.map((product) => product.categories.map((item) => item.slug)).flat(1);
   const categories_count = [...new Set(listCategoriesProduct)].map((categorie) => {
      return { slug: categorie, count: listCategoriesProduct.filter((item) => item === categorie).length };
   });
   // console.log(`  *** categories_count`, categories_count)

   // console.timeEnd("time2");

   return { per_page, page, list_products, total_products };
};

const findProductBySlugDb = async (slug) => {
   return await db.products.findOne(slug);
};

module.exports = { findAllProductsBySlugDb, findProductBySlugDb };
