const express=require("express")
const router=express.Router()
const User=require("../models/user")
const wrapAsyncs = require("../utils/wrapAsyncs")
const passport = require("passport")
router.get("/signup",(req,res)=>{
    res.render("users/signup")
    })

router.post("/signup",wrapAsyncs(async(req,res,next)=>{
  try{
    let{username,email,passward}=req.body;
  let userinfo=await new User({
      username:username,
      email:email
  })
 const registedrUser= await User.register(userinfo,passward)
 req.login(registedrUser,(err)=>{
if(err){
 return next(err)
}
req.flash("success","you signUp successfully")
res.redirect("/client")
 })

  }catch(er){
    console.log(er)
    req.flash("error",er.message)
    res.redirect("/signup")
  }
 
}))
    router.get("/login",(req,res)=>{
      res.render("users/login")
    })

    router.post("/login",passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),async(req,res)=>{
      req.flash("success","Logged in")
      res.redirect("/client")
    })
    router.get("/logout",(req,res)=>{
      res.send("logged out")
    })

    module.exports=router

    // passport.authenticate("local",{failureRedirect:"/login",failureFlash:true})
    // ,async(req,res)=>{
    //  