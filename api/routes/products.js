const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products')
const auth = require('../middleware/authenticate');
const multer = require('multer');


const storage = multer.diskStorage({
    destination: function (req, file, cd) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cd(null, new Date().toDateString = file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        //reject file
        cb(null, false)
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024
    },
    fileFilter: fileFilter
})

router.get('/', productsController.getProducts);

router.post('/', auth, upload.single('productImage'), productsController.addNewProduct);

router.delete('/:productId', auth, productsController.deleteProduct);

router.put('/:productId', auth, productsController.updateProduct);

router.get('/:productId', productsController.getSpecificProduct);

module.exports = router;