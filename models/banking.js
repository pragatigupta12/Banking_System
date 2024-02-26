const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const bankingSchema=new Schema({
    Username:String,
    AccNumber:Number,
    Ammount:{
        type:Number,  
    }
})
const initBank = mongoose.model('initBank', bankingSchema);

module.exports=initBank
