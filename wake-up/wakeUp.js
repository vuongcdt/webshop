const { default: axios } = require("axios");
let timeId;
const wakeUp = () => {
   clearInterval(timeId);
   setTimeout(() => {
      fetchSever();
   }, 30 * 1000);
   timeId = setInterval(() => {
      fetchSever();
   }, 5 * 60 * 1000);  
};

const fetchSever = async () => {
   const time = new Date().toLocaleString();
   const result = await axios.get("https://webshop-sigma.vercel.app/api/product/terry-polo-shirt");
   console.log(`  *** result:`, result.data.name, ", time: ", time);
};
module.exports = { wakeUp };
