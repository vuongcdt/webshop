const { db } = require(".");

const findOneProductBySlugDb = async (slug) => {
   return await db.products.findOne(slug);
};

const findAllProductsBySlugDb = async ({ per_page, page, order, orderby, slug, pa_color, pa_brand, range_price, pa_discount, pa_rating }) => {
   const filter = {};

   if (slug) filter["categories.slug"] = slug;
   if (pa_color) filter["color.slug"] = pa_color;
   if (pa_brand) filter["brand.slug"] = pa_brand;
   if (pa_discount) filter.discount = { $gte: +pa_discount };
   if (pa_rating) filter.rating = { $gte: +pa_rating, $lt: +pa_rating + 1 };
   if (range_price) {
      const rangePrice = range_price.split(":");
      filter.price = { $gt: +rangePrice[0], $lt: +rangePrice[1] };
   }

   const dataDb = await db.products
      .aggregate([
         {
            $match: filter,
         },
         {
            $set: {
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
               // brand: [{ $addFields: { document: "$$ROOT" } }, { $sortByCount: "$brand" }, { $addFields: { checked: false } }],
               // color: [{ $unwind: "$color" }, { $sortByCount: "$color" }],
               // categories: [{ $unwind: "$categories" }, { $sortByCount: "$categories" }],
               // price: [{ $group: { _id: null, max: { $max: "$price" }, min: { $min: "$price" } } }],
               // rating: [{ $sortByCount: "$rating" }],
               // discount: [{ $sortByCount: "$discount" }],
            },
         },
      ])
      .toArray();

   const dataFilter = filterDb(filter);
   console.log(`  *** dataFilter`, dataFilter[0]);
   const discount = discountEdit(dataDb[0].discount);
   const rating = ratingEdit(dataDb[0].rating);
   const { list_products, total_products } = dataDb[0];

   return {
      per_page,
      page,
      list_products,
      total_products: total_products[0]?.count || 0,
      filter: dataFilter[0],
   };
};

const filterDb = async (filter) => {
   const filterCategories = { ...filter };
   delete filterCategories["categories.slug"];
   const filterColor = { ...filter };
   delete filterColor["color.slug"];
   const filterBrand = { ...filter };
   delete filterBrand["brand.slug"];
   const filterDiscount = { ...filter };
   delete filterDiscount.discount;
   const filterRating = { ...filter };
   delete filterRating.rating;
   const filterPrice = { ...filter };
   delete filterPrice.price;

   return await db.products
      .aggregate([
         {
            $facet: {
               brand: [
                  {
                     $match: filterBrand,
                  },
                  { $addFields: { document: "$$ROOT" } },
                  { $sortByCount: "$brand" },
               ],
               color: [
                  {
                     $match: filterColor,
                  },
                  { $unwind: "$color" },
                  { $sortByCount: "$color" },
               ],
               categories: [
                  {
                     $match: filterCategories,
                  },
                  { $unwind: "$categories" },
                  { $sortByCount: "$categories" },
               ],
               price: [
                  {
                     $match: filterPrice,
                  },
                  { $group: { _id: null, max: { $max: "$price" }, min: { $min: "$price" } } },
               ],
               rating: [
                  {
                     $match: filterRating,
                  },
                  { $sortByCount: "$rating" },
               ],
               discount: [
                  {
                     $match: filterDiscount,
                  },
                  { $sortByCount: "$discount" },
               ],
            },
         },
      ])
      .toArray();
};

const discountEdit = (listDiscount) =>
   [0, 10, 20, 30, 40, 50]
      .map((value, index) => {
         const listDiscountFilter = listDiscount.filter(({ _id, count }) => (_id >= value) & (_id - 10 < value)).map(({ count }) => count);
         const totalCount = eval(listDiscountFilter.join("+"));
         return { name: `${value}% and above`, slug: value, count: totalCount };
      })
      .filter(({ count }) => count);

const ratingEdit = (listRating) =>
   [0, 1, 2, 3, 4, 5]
      .map((value, index) => {
         const listRatingFilter = listRating.filter(({ _id, count }) => _id >= value && _id < value + 1).map(({ count }) => count);
         const totalCount = eval(listRatingFilter.join("+"));
         return { slug: value, count: totalCount };
      })
      .filter(({ count }) => count)
      .sort((a, b) => b.slug - a.slug);

module.exports = { findAllProductsBySlugDb, findOneProductBySlugDb };
