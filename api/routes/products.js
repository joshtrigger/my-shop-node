const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products')
const auth = require('../middleware/authenticate');
const upload = require('../multer');

router.get('/', productsController.getProducts);

router.post('/', auth, upload.single('productImage'), productsController.addNewProduct);

router.delete('/:productId', auth, productsController.deleteProduct);

router.put('/:productId', auth, productsController.updateProduct);

router.get('/:productId', productsController.getSpecificProduct);

router.get('/user/products', auth, productsController.getUsersProducts)

module.exports = router;