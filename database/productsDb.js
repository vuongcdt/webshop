const { db } = require(".");

const findOneProductBySlugDb = async (slug) => {
   return await db.products.findOne(slug);
};

const findAllProductsByQueryDb = async ({ per_page, page, order, orderby, slug, pa_color, pa_brand, range_price, pa_discount, pa_rating, key }) => {
   const filter = {};

   if (slug) filter["categories.slug"] = { $in: slug.split(",") };
   if (pa_color) filter["color.slug"] = { $in: pa_color.split(",") };
   if (pa_brand) filter["brand.slug"] = { $in: pa_brand.split(",") };
   if (pa_discount) filter.discount = { $gte: +pa_discount };
   if (pa_rating) filter.rating = { $gte: +pa_rating, $lt: +pa_rating + 1 };
   if (range_price) {
      const [min, max] = range_price.split(":");
      filter.price = { $gt: +min, $lt: +max };
   }

   const dataDb = await db.products
      .aggregate([...configSearchAndFilterToAggregate(filter, key), ...configSortToAggregate(per_page, page, order, orderby)])
      .toArray();

   const dataFilter = await filterSidebar(filter);
   const discount = listDiscountEdit(dataFilter[0].discount, pa_discount);
   const rating = listRatingEdit(dataFilter[0].rating, pa_rating);
   const brand = dataFilter[0].brand
      .map(({ _id, count }) => ({ count, slug: _id.slug, name: _id.name, checked: _id.slug === pa_brand }))
      .sort((a, b) => a.slug.localeCompare(b.slug));
   const color = dataFilter[0].color
      .map(({ _id, count }) => ({ count, slug: _id.slug, name: _id.name, checked: _id.slug === pa_color }))
      .sort((a, b) => a.slug.localeCompare(b.slug));
   const categories = dataFilter[0].categories
      .map(({ _id, count }) => ({ count, slug: _id.slug, name: _id.name, checked: _id.slug === slug }))
      .sort((a, b) => a.slug.localeCompare(b.slug));
   const price = { min: String(dataFilter[0].price[0].min), max: String(dataFilter[0].price[0].max) };
   if (range_price) {
      const [min, max] = range_price.split(":");
      price.minHandle = min;
      price.maxHandle = max;
   }
   const { list_products, total_products } = dataDb[0];

   return {
      per_page,
      page,
      list_products,
      total_products: total_products[0]?.count || 0,
      filterSidebar: { brand, discount, color, categories, price, rating },
   };
};

const configSearchAndFilterToAggregate = (filter, key) => {
   if (key) {
      return [
         ...key.split("_").map((char) => ({
            $match: {
               key_search: {
                  $regex: char,
               },
            },
         })),
         {
            $match: filter,
         },
      ];
   } else {
      return [
         {
            $match: filter,
         },
      ];
   }
};

const configSortToAggregate = (per_page, page, order, orderby) => {
   return [
      {
         $set: {
            temp: 1,
         },
      },
      {
         $facet: {
            total_products: [{ $sortByCount: "$temp" }],
            list_products: [
               { $sort: { [orderby]: order } },
               { $skip: +per_page * (+page - 1) },
               { $limit: +per_page },
               {
                  $project: {
                     _id: 1,
                     back_image: 1,
                     front_image: 1,
                     short_description: 1,
                     color: 1,
                     brand: 1,
                     size: 1,
                     categories: 1,
                     date_create: 1,
                     name: 1,
                     slug: 1,
                     on_sale: 1,
                     discount: 1,
                     price: 1,
                     rating: 1,
                     regular_price: 1,
                     rating_count: 1,
                     // _id: 0,
                     // key_search: 1,
                  },
               },
            ],
         },
      },
   ];
};

const filterSidebar = async (filter) => {
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

const listDiscountEdit = (dataFilter, pa_discount) =>
   [0, 10, 20, 30, 40, 50]
      .map((value, index) => {
         const listDiscountFilter = dataFilter.filter(({ _id }) => (_id >= value) & (_id - 10 < value)).map(({ count }) => count);
         const totalCount = eval(listDiscountFilter.join("+"));
         return { name: `${value}% and above`, slug: String(value), count: totalCount, checked: +pa_discount === value };
      })
      .filter(({ count }) => count);

const listRatingEdit = (dataFilter, pa_rating) =>
   [0, 1, 2, 3, 4, 5]
      .map((value, index) => {
         const listRatingFilter = dataFilter.filter(({ _id }) => _id >= value && _id < value + 1).map(({ count }) => count);
         const totalCount = eval(listRatingFilter.join("+"));
         return { slug: String(value), count: totalCount, checked: +pa_rating === value };
      })
      .filter(({ count }) => count)
      .sort((a, b) => b.slug - a.slug);

module.exports = { findAllProductsByQueryDb, findOneProductBySlugDb };
