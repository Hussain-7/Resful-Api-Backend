const express=require("express");
const router=express.Router();
const mongoose=require('mongoose');
const Product= require('../models/product');

router.get('/',(req,res,next)=>{
    Product.find()
    .select('name price _id')
    .exec()
    .then(docs=>{
        const response={
            count:docs.length,
            products:docs.map(doc=>{
                return{
                    product:doc,
                    request:{
                        type:'GET',
                        url:'http://localhost:3000/products/'+doc._id
                    }
                }
            })
        }
        res.status(200).json({
            Products:response
        });
    }).catch((err=>{
        console.log(err);
        res.status(500).json({
            error:err,
        })
    }))
});
router.post('/',(req,res,next)=>{
    const product= new Product({...req.body})
    product.save()
    .then(result=>{
        console.log(result)
        res.status(201).json({
            message:'Created Products Successfuly',
            CreatedProduct:{
                _id:result._id,
                name:result.name,
                price:result.price,
                request:{
                    type:'GET',
                    url:'http://localhost:3000/products/'+result._id
                }
            }
        });
    }).catch((error)=>{
        console.log(error);
        res.status(500).json({
            error:error
        })
    }) 
});
router.get('/:productId',(req,res,next)=>{
    let id=req.params.productId;
    Product.findById(id)
    .select("_id name price")
    .exec().then(doc=>{
        console.log("From Databasse :",doc);
        res.status(200).json({
            product: doc,
            request: {
                type: 'GET',
                description:"To get all products",
                url: 'http://localhost:3000/products'
            } 
        })
    }).catch(err=>{
        console.log(err)
        res.status(500).json({
            message:"No valid object id provided",
            error:err
        })
    });
});
router.put('/:productId',(req,res,next)=>{
    const id = req.params.productId;

    Product.updateOne({_id:id},{...req.body})
    .exec()
    .then((doc)=>{
        res.status(200).json({
            message: 'Product updated',
             request: {
              type: 'GET',
              url: 'http://localhost:3000/products/' + id
          }
        });
    }).catch()
});
router.patch('/:productId',(req,res,next)=>{
    const id = req.params.productId;
    const updateOps={};
    // Fro this way of updating req.body must be an array of objects
    for(const ops of req.body)
    {
        updateOps[ops.propName]=ops.value;
    }
    Product.updateOne({_id:id},{$set:updateOps})
    .exec()
    .then((doc)=>{
        res.status(200).json({
            message: 'Product updated',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/products/' + id
            }
        });
    }).catch()
    
 
});
router.delete('/:productId',(req,res,next)=>{
    Product.deleteOne({_id:req.params.productId})
    .exec()
    .then(result=>{
        res.status(200).json({
            message: 'Product deleted',
          request: {
              type: 'POST',
              url: 'http://localhost:3000/products',
              body: { name: 'String', price: 'Number' }
          }
        });
    })
    .catch(err=>{
        res.status(500).json({
            error:err,
        });
    }
    );
  
   
});
module.exports=router;