const express =require('express');
const app=express();
// package for default logging in the terminal here 
// we are actually tell express to funel every request through the morgan middlewhere
const morgan=require('morgan');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');



const productRoutes=require('./api/routes/products');
const orderRoutes=require('./api/routes/orders')
// Hussain:Hussain-2000
mongoose.connect('mongodb+srv://Hussain:'+process.env.Mongo_Atlas_PW+'@hussain.lmznc.gcp.mongodb.net/Rest-Api-database?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Origin,X-requested-With,Content-Type,Accept,Authorization');
    
    if(req.method=='OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET')
        return res.status(200).json({});
    }
    next();
});


// Routes which should handle requests
app.use('/products',productRoutes);
app.use('/orders',orderRoutes);

// Routes for handling errors
app.use((req,res,next)=>{
    const error=new Error('Not Found');
    error.status=404;
   next(error);
});

app.use((error,req,res,next)=>{
res.status(error.status||500);
res.json({
    error:{
        message:error.message
    }
})
});
module.exports=app;