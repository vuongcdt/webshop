const { searchAllProductsDb } = require("../database/searchAllProductsDB")

const searchCtrl=async(key)=>{
    return await searchAllProductsDb(key)
}

module.exports={searchCtrl}