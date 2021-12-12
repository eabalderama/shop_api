const express = require('express');
const router = express.Router();
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_CONNECTION, () => {
  console.log("Database connected");
})

app.use(cors({origin: true, credentials: true}));
app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

router.use('/products', require('./api/routes/products'));
router.use('/orders', require('./api/routes/orders'));
router.use('/users', require('./api/routes/users'));

app.use('/api',router);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  })
});

module.exports = app;