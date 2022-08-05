const { db } = require(".");

const findOneProductBySlugDb = async (slug) => {
   return await db.products.findOne(slug);
};

const findAllProductsByQueryDb = async ({ per_page, page, order, orderby, slug, pa_color, pa_brand, range_price, pa_discount, pa_rating, key }) => {
   const filter = {};

   if (slug) filter["categories.slug"] = slug;
   if (pa_color) filter["color.slug"] = { $in: pa_color.split(",") };
   if (pa_brand) filter["brand.slug"] = { $in: pa_brand.split(",") };
   if (pa_discount) filter.discount = { $gte: +pa_discount };
   if (pa_rating) filter.rating = { $gte: +pa_rating, $lt: +pa_rating + 1 };
   if (range_price) {
      const [min, max] = range_price.split(":");
      filter.price = { $gt: +min, $lt: +max };
   }

   const dataDb = await db.products
      .aggregate([
         ...configSearchAndFilterToAggregate(filter, key),
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
                  // {
                  //    $project: {
                  //       _id: 1,
                  //       back_image: 1,
                  //       front_image: 1,
                  //       short_description: 1,
                  //       color: 1,
                  //       brand: 1,
                  //       size: 1,
                  //       categories: 1,
                  //       date_create: 1,
                  //       name: 1,
                  //       slug: 1,
                  //       on_sale: 1,
                  //       discount: 1,
                  //       price: 1,
                  //       rating: 1,
                  //       regular_price: 1,
                  //       rating_count: 1,
                  //    },
                  // },
                  {
                     $project: {
                        _id: 0,
                        // name: 1,
                        // brand:1,
                        key_search: 1,
                     },
                  },
               ],
            },
         },
      ])
      .toArray();

   const dataFilter = await filterSidebar(filter);
   const discount = listDiscountEdit(dataFilter[0].discount);
   const rating = listRatingEdit(dataFilter[0].rating);
   const { list_products, total_products } = dataDb[0];
   const { brand, color, categories, price } = dataFilter[0];

   return {
      per_page,
      page,
      list_products,
      total_products: total_products[0]?.count || 0,
      filterSidebar: { brand, discount, color, categories, price, rating },
   };
};

const configSearchAndFilterToAggregate = (filter, key) => {
   // key=key.replace('_',' ')

   console.log(`  *** key`, key);
   if (key) {
      return [
         ...key.split('_').map(chart=>({$match:{
            key_search:{
               $regex:chart
            }
         }})),

         // {
         //    $search: {
         //       index: "default",
         //       text: {
         //          query: key.replace("_", " "),
         //          path: {
         //             wildcard: "*",
         //          },
         //       },
         //    },
         // },

         // {
         //    $search: {
         //       compound: {
         //          // should: [
         //          //    {
         //          //       autocomplete: {
         //          //          query: key.replace("_", " "),
         //          //          path: "key_search",
         //          //       },
         //          //    },
         //          // ],

         //          // must: [{
         //          //    autocomplete: {
         //          //       query: key.replace('_',' '),
         //          //       path: "brand.slug"
         //          //    }
         //          // }],

         //          // should: [{
         //          //    autocomplete: {
         //          //       query: key.replace('_',' '),
         //          //       path: 'name'
         //          //    }
         //          // }],

         //          must: key.split("_").map((word) => ({
         //             autocomplete: {
         //                query: word,
         //                path: "key_search",
         //                // fuzzy:{
         //                //    maxEdits:1
         //                // }
         //             },
         //          })),
         //       },
         //    },
         // },
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

const listDiscountEdit = (dataFilter) =>
   [0, 10, 20, 30, 40, 50]
      .map((value, index) => {
         const listDiscountFilter = dataFilter.filter(({ _id }) => (_id >= value) & (_id - 10 < value)).map(({ count }) => count);
         const totalCount = eval(listDiscountFilter.join("+"));
         return { name: `${value}% and above`, slug: value, count: totalCount };
      })
      .filter(({ count }) => count);

const listRatingEdit = (dataFilter) =>
   [0, 1, 2, 3, 4, 5]
      .map((value, index) => {
         const listRatingFilter = dataFilter.filter(({ _id }) => _id >= value && _id < value + 1).map(({ count }) => count);
         const totalCount = eval(listRatingFilter.join("+"));
         return { slug: value, count: totalCount };
      })
      .filter(({ count }) => count)
      .sort((a, b) => b.slug - a.slug);

module.exports = { findAllProductsByQueryDb, findOneProductBySlugDb };
