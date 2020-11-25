const express = require('express');
const router=express.Router();
const adminUsers=require('../schemas/adminUsers');
const cat=require('../schemas/category');
const sha1 = require('sha1');
const multer = require('multer');
const nodemailer = require("nodemailer");

const product=require('../schemas/products');
const history=require('../schemas/history');

require('dotenv').config()

email_username=process.env.email_username;

email_password=process.env.email_password;

// For File Uploading
let DIR="./files";

const storage=multer.diskStorage(
    {
        destination: (req,file,cb)=>{
            cb(null,DIR);
        },
        filename:(req,file,cb)=>{
            cb(null,file.fieldname+'-'+Date.now()+'.'+file.originalname.split('.')[file.originalname.split('.').length-1])
        }
    }
)

let upload=multer({storage:storage}).single('Image')




// For File Uploading







router.post('/api/login',(req,res)=>{

    let email=req.body.email;
    let pass=sha1(req.body.password);

    // Login User

    adminUsers.findOne((err,data)=>{
        if(err){
            res.send({err:1,msg:err})
        }else{
            if(email==data.email && pass==data.password){
                let insertHistory=history({'email':data.email});
                insertHistory.save((err)=>{
                    if(err){
                        res.send({err:1})
                    }
                    else{
                        res.send({err:0})
                        console.log('done');
                    }
                })
                res.send({err:0,msg:data.email})

            }else if(email != data.email || pass!=data.password){
                res.send({err:1,msg:"Please Check Email Or Password"})
            }
        }
    })


    // Insert User

    // let ins=adminUsers({'email':email,'password':pass});
    // ins.save((err)=>{
    //     if(err){
    //         res.send({err:1,msg:err})
    //     }else{
    //         res.send({err:0,msg:'Successfully Added'})
    //     }
    // })
})

router.post('/api/addcategory',(req,res)=>{
   upload(req,res,(err)=>{
       if(err){
        res.send({err:1,msg:'Some Error In File Uploading'})
       }else{
           let catName=req.body.catName;
           let catDesc=req.body.catDesc;
           let fname=req.file.filename;
           let username=req.body.username;

           let ins=new cat({
               'cname':catName,
                'description':catDesc,
                'addedBy':username,
                'Image':fname
           })

        //    inserting into db and moving file
            ins.save((err)=>{
                if(err){
                    res.send({err:1,msg:err})
                }else{
                    res.send({err:0,msg:'Category Successfully Added'})
                }
            })
        // end
       }
   })
})


router.get('/api/category',(req,res)=>{
    cat.find((err,data)=>{
        if(err){
            res.send({err:1,msg:err})
        }else{
            res.send({err:0,msg:data})
        }
    })
})


// delete cat
router.get('/api/delcat/:key',(req,res)=>{
    let cId=req.params.key;
    catModel.remove({'_id':cId},(err)=>{
        if(err){
            res.send({err:1,msg:'Not Delete Successfully'})
        }else{
            res.send({err:0,msg:'Delete Successfully'})
            
        }
    })
})


// change password
router.post('/api/changepass',(req,res)=>{
    let id=req.body.id;
    let op=sha1(req.body.op);
    let np=sha1(req.body.np);

    adminUsers.findOne({email:id},(err,data)=>{
        if(err){
            res.send({err:1,msg:err})
        }else{
            if(op != data.password){
                res.send({'err':1,msg:'Please Check Your Orignal Pass'})
            }else{
                adminUsers.updateOne({email:id},{$set:{password:np}},(err)=>{
                    if(err){
                        res.send({'err':1,msg:'Password Cant update'})
                    }else{
                        res.send({'err':0,msg:'Password Change Successfully'})
                    }
                })
            }
        }
    })

})


// addProduct
router.post('/api/addproduct', (req, res) => {
    upload(req,res,(err)=>{
        if(err){
         res.send({err:1,msg:'Some Error In File Uploading'})
        }else{
            let cname=req.body.cname;
            let description=req.body.description;
            let fname=req.file.filename;
            let price=req.body.price;
            let title=req.body.title;
            let discount=req.body.discount;
            let username=req.body.username;
 
            let ins=new product({
                'cname':cname,
                 'title':title,
                 'addedBy':username,
                 'Image':fname,
                 'price':price,
                 'description':description,
                 'discount':discount,
                 'status':'active'
            })
 
         //    inserting into db and moving file
             ins.save((err)=>{
                 if(err){
                     res.send({err:1,msg:err})
                 }else{
                     res.send({err:0,msg:'Product Successfully Added'})
                 }
             })
         // end
        }
    })

});


router.get('/api/products',(req,res)=>{
    product.find({'status':'active'},(err,data)=>{
        if(err){
            res.send({err:1,msg:err})
            
        }else{
            res.send({err:0,msg:data})
        }
    })
})


router.get('/api/test',(req,res)=>{

async function main() {
  let testAccount = await nodemailer.createTestAccount();
  let transporter = nodemailer.createTransport({    
    host: 'smtp.hostinger.in',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'testing@radioharyanvi.com', // generated ethereal user
      pass: 'Admin@123', // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <testing@radioharyanvi.com>', // sender address
    to: "punia.umesh@gmail.com,sahasrajput50@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello Sahas?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

main().catch(console.error);

})

module.exports=router;




