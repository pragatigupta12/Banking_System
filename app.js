const express=require("express");
const app=express()
const port=8080
const mongoose = require('mongoose');
app.set("view engine","ejs");
const path=require("path");
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")))
let methodOverride = require('method-override')
app.use(methodOverride('_method'))
const ejsMate=require("ejs-mate")
app.engine('ejs', ejsMate);
const ExpressError=require("./utils/ExpressError")
const clientRouter=require("./routes/client")
const userRouter=require("./routes/user")
const session=require("express-session")
const flash=require("connect-flash")
const passport=require("passport")
const LocalStrategy=require("passport-local")
const User=require("./models/user")
const sessionOption={
  secret:"mysupersecret",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true
  }
}

main().then(()=>{
    console.log("connection successfully")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/bankingSystem');

}

app.use(session(sessionOption))
app.use(flash())
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
  res.locals.success=req.flash("success")
  res.locals.error=req.flash("error")
  next()
})

// client
// app.get("/demouser",async(req,res)=>{
//   let userinfo=new User({
//     email:"hello.@gmail.com",
//     username:"hello"
//   })
// let newuser=await User.register(userinfo,"12345")
// res.send(newuser)
// })
app.use("/client",clientRouter)
app.use("/",userRouter)
app.use((req,res,next)=>{
  next(new ExpressError("page not found",404))
})

app.use((err,req,res,next)=>{
  let{status=500 ,message="something went wrong"}=err;
res.status(status).render("error.ejs",{message})
next()
})
app.listen(port,()=>{
    console.log(`port is listening on port ${port}`)
})