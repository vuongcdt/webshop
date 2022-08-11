const { default: axios } = require("axios");

const wakeUp = () => {
   setInterval(async () => {
      const hours = new Date().getHours();
      const minutes = new Date().getMinutes();
      if (hours > 7 && hours < 23) {
         const result = await axios.get("https://webshop-sigma.vercel.app/api/product/terry-polo-shirt");
         console.log(`  *** result:`, result.data.slug, ",time: ", hours + "/", minutes);
      }
   }, 5 * 60 * 1000);
}; 
module.exports = { wakeUp };
 