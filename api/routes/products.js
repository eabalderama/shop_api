const e = require('express');
const express = require('express');
const router = express.Router();
// const multer = require('multer');
const fileParser = require('../middleware/fileParser');
const checkAuth = require('../middleware/check_auth');
const ProductActions = require('../controllers/product');



router.get('/', ProductActions.getProducts);
router.get('/:productId', ProductActions.getProductsById);
router.post('/', checkAuth, fileParser.single('productImage'), ProductActions.addProduct);
router.patch('/:productId', checkAuth, ProductActions.updateProduct);
router.delete('/:productId', checkAuth, ProductActions.deleteProduct);

module.exports = router;