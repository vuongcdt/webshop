const express=require('express')
const { fetchApiGetCategories } = require('../controllers/crawlCtrl')
const router=express.Router()

router.get('/',(req,res)=>{
    fetchApiGetCategories('dresses')
    res.send('roter crawl')
})

module.exports=router