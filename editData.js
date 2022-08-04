const { dataDb } = require("./datadb");

const editData = () => {
   return dataDb.map(
      ({
         back_image,
         front_image,
         guide,
         specifications,
         question_and_answers,
         description,
         short_description,
         attributes,
         categories,
         date_created,
         dimensions,
         id,
         images,
         name,
         list_variation,
         on_sale,
         discount,
         permalink,
         price,
         price_html,
         rating,
         rating_count,
         regular_price,
         related_ids,
         slug,
         sale_price,
         stock_quantity,
         tags,
         _links,
      }) => {
         if (!attributes.color || !attributes.brand) {
            console.log(id);
         }
         return {
            back_image,
            front_image,
            guide,
            specifications,
            question_and_answers,
            description,
            short_description,
            color,
            brand,
            size,
            categories,
            date_created,
            dimensions,
            id,
            images,
            name,
            list_variation,
            on_sale,
            discount,
            permalink,
            price,
            price_html,
            rating,
            rating_count,
            regular_price,
            related_ids,
            slug,
            sale_price,
            stock_quantity,
            tags,
            _links,
         };
      }
   );
};
module.exports = { editData };
