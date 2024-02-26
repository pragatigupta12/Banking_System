const initdata=require("./data")
const Banking=require("../models/banking")
const mongoose = require('mongoose');
main().then(()=>{
    console.log("connection successfully")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/bankingSystem');

}

const intDB=async()=>{
    await Banking.deleteMany();
    await Banking.insertMany(initdata.data)
    console.log("data was initilized")
}

intDB()