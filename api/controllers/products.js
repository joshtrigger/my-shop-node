const Product = require('../models/product');
const mongoose = require('mongoose');

const getProducts = (req, res, next) => {
    Product.find()
        .then(result => {
            if (result.length > 0) {
                res.status(200).json(result)
            } else {
                res.status(200).json({
                    message: 'No products were found'
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

const addNewProduct = (req, res, next) => {
    console.log(req.file)
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        creationDate: Date.now(),
        category: req.body.category
    });

    product.save()
        .then(() => {
            res.status(201).json({
                message: 'product has been created successfully'
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

const deleteProduct = (req, res, next) => {
    const id = req.params.productId;
    Product.remove({
            _id: id
        })
        .exec()
        .then(() => {
            res.status(200).json({
                message: `product of id ${id} has been deleted`
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
}

const updateProduct = (req, res, next) => {
    const id = req.params.productId;
    Product.update({
            _id: id
        }, {
            $set: req.body
        })
        .exec()
        .then(() => {
            res.status(200).json({
                message: 'product has been successfully updated',
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
}

const getSpecificProduct = (req, res, next) => {
    const id = req.params.productId
    Product.findById(id).exec()
        .then(result => {
            if (result) {
                res.status(200).json(result)
            } else {
                res.status(404).json({
                    message: `product of id ${id} does not exist`
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

module.exports = {
    getProducts,
    getSpecificProduct,
    addNewProduct,
    deleteProduct,
    updateProduct
}