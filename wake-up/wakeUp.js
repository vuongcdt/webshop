const { default: axios } = require("axios");
let timeId;
const wakeUp = () => {
   clearInterval(timeId);
   timeId = setInterval(async () => {
      const time = new Date().toLocaleString();
      const result = await axios.get("https://webshop-sigma.vercel.app/api/product/terry-polo-shirt");
      console.log(`  *** result:`, result.data.name, ", time: ", time);
   }, 5 * 60 * 1000);
};
module.exports = { wakeUp };
