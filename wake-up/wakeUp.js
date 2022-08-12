const { default: axios } = require("axios");
let timeId;
const wakeUp = () => {
   clearInterval(timeId);
   fetchMyWeb();
   timeId = setInterval(() => {
      fetchMyWeb();
   }, 5 * 60 * 1000);
};
const fetchMyWeb = async () => {
   try {
      const time = new Date().toLocaleString();
      const result = await axios.get("https://webshop-sigma.vercel.app/api/product/terry-polo-shirt");
      console.log(`  *** result:`, result.data.name, ", time: ", time);
   } catch (error) {
      console.log(`  *** error get/ `, error);
   }
};

module.exports = { wakeUp };
