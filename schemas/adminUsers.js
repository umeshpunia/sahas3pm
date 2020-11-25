const mongoose = require('mongoose');

const Schema=mongoose.Schema;

const adminUsers= new Schema({
    name:{type:String},
    mobile:{type:String,unique:true},
    email:{type:String,unique:true},
    password:{type:String,required:true},
    addedBy:{type:String},
    status:{type:String},
    addedOn:{type:Date,default:Date.now()}
})


module.exports=mongoose.model('adminUsers',adminUsers)

