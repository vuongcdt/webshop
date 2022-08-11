const { default: axios } = require("axios");
let timeId;
const wakeUp = async () => {
   clearInterval(timeId);
   try {
      await axios.get("https://webshop-sigma.vercel.app/");
   } catch (error) {
      console.log(`  *** error get/`, error);
   }
   timeId = setInterval(async () => {
      try {
         const time = new Date().toLocaleString();
         const result = await axios.get("https://webshop-sigma.vercel.app/api/product/terry-polo-shirt");
         console.log(`  *** result:`, result.data.name, ", time: ", time);
      } catch (error) {
         console.log(`  *** error get/ setInterval`, error);
      }
   }, 5 * 60 * 1000);
};

module.exports = { wakeUp };
