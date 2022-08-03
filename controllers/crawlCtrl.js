const { default: axios } = require("axios");

const BASE_URL_API = 'https://voxohub.xyz';

const fetchApi = axios.create({
   baseURL: BASE_URL_API + "/wp-json/wc/v3/",
   headers: {
      "content-type": "application/json",
      Authorization: "Basic Y2tfYWI0NGZmOThiN2FjOGM2MjliMTA3Mzk5ZWIwYjBjOGMyNmUwNDhjNDpjc18wYmRiZTI2OWM5NjA5OGJmZDY1N2FiZDRlMmQ3NTI2MzJmNDZhYTIw",
   },
});

const fetchApiGetCategories = async (slug) => {
   try {
      const response = await fetchApi.get("/products/categories/?slug=" + slug);
      const responseId = response.data[0].id;
      const url = "/products?" + "per_page=100";

      const data = await fetchApi.get(url);
    //   console.log(`  *** data`, data.data)
      data.idCategory = responseId;
      return data.data;
   } catch (error) {
      console.log("error fetchApiGetCategories", error);
   }
};

module.exports = { fetchApiGetCategories };
