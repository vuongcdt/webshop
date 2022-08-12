const { default: axios } = require("axios");
let timeId;
const wakeUp = () => {
   clearInterval(timeId);
   fetchMyWeb();
   timeId = setInterval(() => {
      fetchMyWeb();
   }, 4 * 60 * 1000);
};
const fetchMyWeb = async () => {
   try {
      const time = new Date().toLocaleString();
      const result = await axios.get("https://webshop-xi.vercel.app/api/product/terry-polo-shirt");
      console.log(`  *** result:`, result.data.name, ", time: ", time);
   } catch (error) {
      console.log(`  *** error get/ `, error);
   }
};

module.exports = { wakeUp };
