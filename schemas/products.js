const mongoose = require('mongoose');

const Schema=mongoose.Schema;

const productSchema= new Schema({
    cname:{type:String},
    title:{type:String},
    price:{type:String},
    discount:{type:String},
    description:{type:String,required:true},
    addedBy:{type:String},
    Image:{type:String},
    addedOn:{type:Date,default:Date.now()},
    status:{type:String}
    
})


module.exports=mongoose.model('products',productSchema)

