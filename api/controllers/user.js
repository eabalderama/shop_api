const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
  signup: async (req, res, next) => {
    const checkEmail = await User.findOne({email: req.body.email});
    if(checkEmail){
      res.status(409).json({
        message: 'Email already exist'
       });
    }else{
      bcrypt.hash(req.body.password, 10, async (err, hash) => {
        if(err){
          return res.status(500).json({
            error: err
          })
        }else{
          const user = new User({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email,
            password: hash
            });
          try{
            const savedUser = await user.save();
            res.status(200).json({
              message: "User created",
              request: {
                method: 'POST',
                url:  req.headers.host+'/users/login',
                body: {
                  email: "String",
                  password: "String"
                }
              }
            })
          }catch(error){
            res.status(500).json({
              error
            })
          }
        }
      });
    }
  },

  login: async (req, res) => {
    try{
      const user = await User.findOne({email: req.body.email});
      if(user){
       const checkPassword = await bcrypt.compare(req.body.password, user.password);
       if(checkPassword){
         const token = jwt.sign({email: user.email, userId: user._id}, process.env.JWT_KEY,{expiresIn: '1h'});
        res.status(200).json({
          message: 'Auth success',
          token: token
        })
      }else{
        res.status(401).json({message: 'Email and password does not match!'});
       }
      }else{
        res.status(401).json({message: 'Email and password does not match!'});
      }
    }catch(error){
      req.status(500).json({error})
    }
    

  },

  getAllUsers: async (req, res) => {
    try{
      const users = await User.find().select('_id email');
      if(users){
        res.status(200).json({
          message: 'Users retrieved successfully.',
          count: users.length,
          users: users.map(user => {
            return {
              _id: user._id,
              email: user.email,
              request: {
                method: 'GET',
                url: req.headers.host+'/users/'+user._id
              }
            }
          })
        });
      }else{
        res.status(404).json({message: 'Users not found.'});
      }
    }catch(error){
      res.status(500).json({error});
    }
  },

  getUserById: async (req, res) => {
    try{
      const user = await User.findById(req.params.userId).select('_id email');
      if(user){
        res.status(200).json({
          message: 'User retrieved successfully.',
          data: {
            _id: user._id,
            email: user.email,
            request: {
              method: 'POST',
              url: req.headers.host+'/users/login',
              body:{
                email: 'String',
                password: 'String'
              }
            }
          }
        });
      }else{
        res.status(404).json({message: 'User does not exist'});
      }
    }catch(error){
      res.status(500).json({error});
    }
  },

  deleteUser: async (req, res) => {
    try{
      const user = await User.findById(req.params.userId);
      console.log('user', user);
      if(user){
        console.log('true');
        const deleted = await User.deleteOne({_id: req.params.userId});
        console.log('deleted', deleted);
        if(deleted['deletedCount']){
          res.status(200).json({
            message: 'User deleted successfully.',
            request: {
              method: 'POST',
              url: req.headers.host+'/signup',
              body: {
                email: 'String',
                password: 'String'
              }
            }
          });
        }else{
          res.status(400).json({message: 'Failed to delete user.'});
        }
      }else{
        res.status(404).json({message: 'User does not exist.'});
      }
    }catch(error){
      res.status(500).json({error: error});
    }
  }
}