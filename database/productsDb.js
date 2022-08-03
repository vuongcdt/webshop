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

   // const total_products = await db.products.countDocuments(filter);
   // const list_products = await db.products
   //    .find(filter)
   //    .sort({ [orderby]: order })
   //    .skip(+per_page * (+page - 1))
   //    .limit(+per_page)
   //    .toArray();

   const dataDb = await db.products
      .aggregate([
         {
            $match: filter,
         },
         {
            $set: {
               brand: "$attributes.brand",
               color: "$attributes.color",
               temp: 1,
            },
         },
         {
            $facet: {
               total_products: [{ $sortByCount: "$temp" }],
               list_products: [
                  { $addFields: { document: "$$ROOT" } },
                  { $sort: { [orderby]: order } },
                  { $skip: +per_page * (+page - 1) },
                  { $limit: +per_page },
               ],
               brand: [{ $sortByCount: "$brand" }],
               color: [{ $unwind: "$color" }, { $sortByCount: "$color" }],
               categories: [{ $unwind: "$categories" }, { $sortByCount: "$categories" }],
               price: [{ $group: { _id: null, max: { $max: "$price" }, min: { $min: "$price" } } }],
               rating: [{ $sortByCount: "$rating" }],
               discount: [{ $sortByCount: "$discount" }],
               // discount: [
               //    {
               //       $match: { discount: { $gte: 10, $lt: 20 } },
               //    },
               //    {
               //       $count: "discount",
               //    },
               // ],
            },
         },
      ])
      .toArray();
   const discountSort = dataDb[0].discount.sort((a, b) => a._id - b._id);
   const discountEdit = [0, 10, 20, 30, 40, 50]
      .map((value, index) => {
         const listDiscount = discountSort.filter(({ _id, count }) => _id >= value).map(({ count }) => count);
         const totalCount = eval(listDiscount.join("+"));
         return { name: `${value}% and above`, slug: value, count: totalCount };
      })
      .filter(({ count }) => count);

   dataDb[0].discount = discountEdit;

   const { list_products, total_products, brand, color, categories, price, rating, discount } = dataDb[0];
   return { per_page, page, list_products, total_products: total_products[0].count, filter: { brand, color, categories, price, rating, discount } };
};

const findProductBySlugDb = async (slug) => {
   return await db.products.findOne(slug);
};

module.exports = { findAllProductsBySlugDb, findProductBySlugDb };
