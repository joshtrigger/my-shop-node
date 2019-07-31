const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products')
const auth = require('../middleware/authenticate');

router.get('/', productsController.getProducts);

router.post('/', auth, productsController.addNewProduct);

router.delete('/:productId', auth, productsController.deleteProduct);

router.put('/:productId', auth, productsController.updateProduct);

router.get('/:productId', productsController.getSpecificProduct);

module.exports = router;