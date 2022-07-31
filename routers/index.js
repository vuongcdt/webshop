const express = require("express");
const authRouter = require("./auth");
const teacherRouter=require('./teacher')

const router = express.Router();

router.use("/auth", authRouter);
router.use('/teacher',teacherRouter)

// router.post('/auth/login',(req,res)=>{
//     console.log('req.body.username',req.body.username);
//     res.send('ok')
// })

module.exports = router;
