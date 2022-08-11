const { default: axios } = require("axios");
let timeId;
const wakeUp = () => {
   clearInterval(timeId);
   setTimeout(async () => {
      try {
         await fetchSever();
      } catch (error) {
         console.log(`  *** error get/`, error);
      }
   }, 30 * 1000);
   timeId = setInterval(async () => {
      try {
         await fetchSever();
      } catch (error) {
         console.log(`  *** error get/`, error);
      }
   }, 5 * 60 * 1000);
};

const fetchSever = async () => {
   const time = new Date().toLocaleString();
   const result = await axios.get("https://webshop-sigma.vercel.app/api/product/terry-polo-shirt");
   console.log(`  *** result:`, result.data.name, ", time: ", time);
};
module.exports = { wakeUp };
