const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

module.exports = {
  getOrders: async (req, res, next) => {
    try{
      const orders = await Order.find().select('_id product quantity').populate('product', '_id name');
      if(orders){
        res.status(200).json({
          count: orders.length,
          orders: orders.map(order => {
            return {
              _id: order._id,
              product: order.product,
              quantity: order.quantity,
              request: {
                method: 'GET',
                url: req.headers.host+'/orders/'+order._id
              }
            }
          })
        });
      }else{
        res.status(404).json({
          message: 'Orders does not exist.'
        })
      }
    }catch(error) {
      res.status(500).json({error});
    }  
  },

  getOrderById: async (req, res, next) => {
    try{
      const order = await Order.findById(req.params.orderId).select('_id product quantity').populate('product', '_id, name');
      if(order){
        res.status(200).json({
          message: 'Order retrieved successfully.',
          data: {
            _id: order._id,
            product: order.product,
            quantity: order.quantity,
            request: {
              method: 'GET',
              url: req.headers.host+'/orders'
            }
          }
        })
      }else{
        res.status(404).json({
          message: 'Order does not exist.'
        })
      }
    }catch(error) {
      res.status(500).json({error});
    }
  },

  addOrder: async (req, res, next) => {
    try{
      const product = await Product.findById(req.body.productId);
      if(product){
        const order = new Order({
          _id: mongoose.Types.ObjectId(),
          quantity: req.body.quantity,
          product: req.body.productId
        });
    
        try{
          const savedOrder = await order.save();
          res.status(200).json({
            message: 'Order saved successfully',
            data: {
              _id: savedOrder._id,
              product: savedOrder.product,
              quantity: savedOrder.quantity,
              request: {
                method: 'GET',
                url: req.headers.host+'/orders/'+savedOrder._id
              }
            }
          })
        }catch(error) {
          res.status(400).json({
            message: 'Failed to save order.'
          });
        }
      }else{
        res.status(404).json({
          message: 'Product does not exist.'
        });
      }
    }catch(error) {
      res.status(500).json({error});
    }
  },

  deleteOrder: async (req, res, next) => {
    try{
      const order = await Order.findById(req.params.orderId);
      if(order){
        const deleted = await Order.deleteOne({_id: req.params.orderId});
        if(deleted['deletedCount']){
          res.status(200).json({
            message: 'Order deleted successfully.',
            request: {
              method: 'POST',
              url: req.headers.host+'/orders',
              body: {
                productId: 'ObjectId',
                quantity: 'Number'
              }
            }
          });
        }else{
          res.status(400).json({message: 'Failed to delete order.'});
        }
      }else{
        res.status(404).json({message: 'Order does not exist.'});
      }
      
    }catch(error) {
      res.status(500).json({message: error});
    }
  }

}