const mongoose = require('mongoose');

const Schema=mongoose.Schema;

const adminUsersHistory= new Schema({
    email:{type:String,unique:true},
    loginOn:{type:Date,default:Date.now()}
})


module.exports=mongoose.model('adminUsersHistory',adminUsersHistory)

