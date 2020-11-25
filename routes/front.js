const express = require('express');
const router=express.Router();
const adminUsers=require('../schemas/adminUsers');
const cat=require('../schemas/category');
const sha1 = require('sha1');
const multer = require('multer');
const nodemailer = require("nodemailer");

const product=require('../schemas/products');
const history=require('../schemas/history');

const paypal=require('paypal-rest-sdk');
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
  }

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AcV17fkejFqAQmSR5VXupit95_Uk7dS5VANkes2iCN-eV75s4SJ8XyydmG3KXkpfUDrmC69rJEqj6aua',
    'client_secret': 'ED9NMRzgHMi61HtArkuPiNZZ80vISo9wH1G13jOVlVAS4-xHJhAUMY9OTama4NGvTiHHh9p7XHXHIGPC'
  });


// localstorage
// getItems=getItems||[];
getItems=JSON.parse(localStorage.getItem('cart'));


// for(let i=0;i < getItems.length;i++){
//     if(getItems[i].price==priceArray[i]){
//       priceArray.reduce((p,c)=>{
//         total= parseFloat(p) + (parseFloat(c)*parseFloat(getItems[i].quantity));
//          localStorage.setItem('total',total);
//       })
//     }
//   }


// get single
router.get('/api/front/category/:id', (req, res) => {
    let id=req.params.id;
    cat.findOne({'_id':id},(err,data)=>{
        if(err){
            res.json({"err":1,"msg":err.message})
        }else{
            res.json({"err":0,"msg":data})
        }
    })
});


// get products using cat
router.get('/api/front/products/:name', (req, res) => {
    let cname=req.params.name;
    cat.find({'cname':cname},(err,data)=>{
        if(err){
            res.json({"err":1,"msg":err.message})
        }else{
            console.log(data);
            res.json({"err":0,"msg":data})
        }
    })
});

router.get('/api/front/product/:id', (req, res) => {
    let pid=req.params.id;
    product.findOne({'_id':pid},(err,data)=>{
        if(err){
            res.json({"err":1,"msg":err.message})
        }else{
            console.log(data);
            res.json({"err":0,"msg":data})
        }
    })
});


router.get('/api/front/getprice/:id', (req, res) => {
    let pid=req.params.id;
    product.findOne({'_id':pid},(err,data)=>{
        if(err){
            res.json({"err":1,"msg":err.message})
        }else{
            console.log(data);
            res.json({"err":0,"msg":data})
        }
    })
});


router.post('/api/front/payment',(req,res)=>{
    const product=[
        {"price":"200","quantity":"5","currency":"INR"}
    ]

    localStorage.setItem('cart',JSON.stringify(product))
    const getItems=JSON.parse(localStorage.getItem('cart'));    

    // paypal
    var create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3000/api/front/success",
            "cancel_url": "http://localhost:3000/api/front/failure"
        },
        "transactions": [{
            "item_list": {
                "items": getItems
            },
            "amount": {
                "currency": "INR",
                "total": "1000"
            },
            "description": "This is the payment description."
        }]
    };

    // paypal

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            // res.send({err:0,msg:payment})
            for(let i=0;i<payment.links.length;i++){
                if(payment.links[i].rel==="approval_url"){
                    res.redirect(payment.links[i].href)
                }
            }
        }
    })

})


router.post('/api/front/failure',(req,res)=>{

})

router.get('/api/front/success',(req,res)=>{
    const product=[
        {'price':200,quantity:5}
    ]

    localStorage.setItem('cart',JSON.stringify(product))
    const getItems=JSON.parse(localStorage.getItem('cart'));
    console.log(getItems);
    // localStorage.setItem('test',1)
})


module.exports=router;