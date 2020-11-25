const mongoose = require('mongoose');

const Schema=mongoose.Schema;

const cat= new Schema({
    cname:{type:String,unique:true},
    description:{type:String,required:true},
    addedBy:{type:String},
    Image:{type:String},
    addedOn:{type:Date,default:Date.now()}
    
})


module.exports=mongoose.model('category',cat)

