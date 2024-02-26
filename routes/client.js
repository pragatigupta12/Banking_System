const express=require("express")
const router=express.Router()
const wrapAsyncs=require("../utils/wrapAsyncs")
const ExpressError=require("../utils/ExpressError")
const bankingSchema=require("../schema")
const Banking=require("../models/banking")
const validateBanking=(req,res,next)=>{
    let {error}=bankingSchema.validate(req.body);
   
    if(error){
     throw new ExpressError(error,400)
    }else{
      next()
    }
  }
router.get("/",(req,res)=>{
    res.render("client/index");
 
  })
  router.post("/",wrapAsyncs(async(req,res)=>{
    let{Username,AccNumber}=req.body;
   let bank=await Banking.find({Username:Username,AccNumber:AccNumber});
  if(bank.length!=0){
  let data=bank[0];
    res.render("client/view",{data})
  }else{
 
  req.flash("error","please enter your correct  information here")

  res.redirect("/client")
  }
   
  }))
  router.get("/:id/credit",wrapAsyncs(async(req,res)=>{
    let{id}=req.params;
    let user=await Banking.findById(id)
   res.render("client/credit",{user})
  }))
  router.get("/:id/debit",wrapAsyncs(async(req,res)=>{
    let{id}=req.params;
    let user=await Banking.findById(id)
   res.render("client/debit",{user})
  }))
  router.put("/:id/credit",validateBanking,wrapAsyncs(async(req,res,next)=>{
  
    let{id}=req.params;
    let{Ammount}=req.body;
   let cli= await Banking.findById(id);
  let val=Number(cli.Ammount)+Number(Ammount)
  let finaval=Number(val)
  let user=await Banking.findByIdAndUpdate(id,{$set:{Ammount:finaval}},{new:true})
  
    res.render("client/afterCredit",{user})
  }))
  
  router.put("/:id/dedit",validateBanking,wrapAsyncs(async(req,res)=>{
    let{id}=req.params;
    let{Ammount}=req.body;
   let cli= await Banking.findById(id);
  let val=Number(cli.Ammount)-Number(Ammount)
  let finaval=Number(val)
  if(Number(cli.Ammount)>Number(Ammount)){
    let user=await Banking.findByIdAndUpdate(id,{$set:{Ammount:finaval}},{new:true})
    res.render("client/afterDebit",{user})
  }else{
    res.send(`you cannot debit this much money ,your available ammont is,${Number(cli.Ammount)}`)
  }
  }))

  module.exports=router