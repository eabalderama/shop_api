const mongoose = require('mongoose');

const Product = require('../models/product');

module.exports = {
  getProducts: (req, res, next) => {
  
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then(result => {
      if(result){
        const response = {
          count: result.length,
          products: result.map(product => {
            return {
              _id: product._id,
              name: product.name,
              price: product.price,
              productImage: product.productImage,
              request: {
                method: 'GET',
                url: req.headers.host+'/products/'+product._id
              }
            }
          })
        }
        res.status(200).json({
          message: "Products successfully retrieved.",
          data: response
        });
      }else{
        res.status(404).json({
          message: 'No products found'
        });
      }
    })
    .catch(error => {
      res.status(500).json({error});
    });
    
  },

  getProductsById: (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then(result => {
      if(result){
        res.status(200).json({
          message: 'Product retrieved successfully.',
          data: {
            _id: result._id,
            name: result.name,
            price: result.price,
            productImage: result.productImage,
            request: {
              method: 'GET',
              url: req.headers.host+'/products'
            }
          }
        });
      }else{
        res.status(404).json({message: 'Product not found'});
      }
      
    })
    .catch(error => {
      res.status(500).json({error});
    });
  },

  addProduct: (req, res, next) => {
    console.log('file path');
    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      price: req.body.price,
      productImage: req.file.path
    })
    
    product.save().then(result => {
      res.status(200).json({
        message: 'Product saved successfully.',
        data: {
          _id: result._id,
          name: result.name,
          price: result.price,
          productImage: result.productImage,
          request: {
            method: 'GET',
            url: req.headers.host+'/products/'+result._id
          }
        }
      });
    })
    .catch(error => {
      res.status(500).json({message: error})
    });
  
    
  },

  updateProduct: (req, res, next) => {
    const id = req.params.productId;
    const {name, price} = req.body;
    const updateOps = {
      name,
      price
    };
    console.log(updateOps);
    Product.updateOne({_id: id}, {$set: updateOps}).exec()
    .then(result => {
      if(result.acknowledged){
        res.status(200).json({
          message: `Product updated successfully.`,
          request: {
              method: 'GET',
              url: req.headers.host+'/products/'+id
            }
        });
      }else{
        res.status(200).json({
          message: `Failed to update product.`,
        });
      }
      
    })
    .catch(error => {
      res.status(500).json({error});
    });
  },

  deleteProduct: (req, res, next) => {
    const id = req.params.productId;
    Product.remove({_id: id}).exec()
    .then(result => {
      res.status(200).json({
        message: `Product deleted successfully.`,
        request: {
          method: 'POST',
          url: req.headers.host+'/products',
          body: {
            name: 'String',
            price: 'Number'
          }
        }
      });
    })
    .catch(error => {
      res.status(500).json({error});
    });
    
  }

}