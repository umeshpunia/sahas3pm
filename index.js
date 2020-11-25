const express=require('express');
const cors = require('cors');
const bodyParser=require('body-parser')
const adminRoutes=require('./routes/admin');
const frontRoutes=require('./routes/front')
const mongoose = require('mongoose');
const dotenv = require('dotenv');
result=dotenv.config();

const pass=process.env.DB_PASSWORD;


const app=express();
const port=process.env.PORT;

app.use(cors());
app.use(bodyParser.json())

// defining api routes
app.use('/',adminRoutes)
app.use('/',frontRoutes);


// changing fake location 
app.use('/images',express.static('files'))

app.use('/',express.static(__dirname + '/front'));

app.use('/admin',express.static(__dirname + '/admin'));

// for mongodb connection
mongoose.connect(`mongodb+srv://umesh:${pass}@umesh.hybg3.mongodb.net/4pm?retryWrites=true&w=majority`,{ useNewUrlParser: true,useUnifiedTopology:true }).then(()=>{
    app.listen(port,()=>{
        console.log(`Server is listen on http://localhost:${port}`);
    })
},err=>{
    console.log(err.message);
})





