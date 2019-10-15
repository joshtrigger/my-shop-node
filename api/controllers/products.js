const Product = require('../models/product');
const mongoose = require('mongoose');
const cloudinary = require('../cloudinary');
const fs = require('fs');
const jwt = require('jsonwebtoken');

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
    const path = req.file.path;
    const token = req.headers.authorization.split(' ')[1]
    const userData = jwt.verify(token, process.env.SECRETKEY);
    const user = {'username':userData.username, 'userId':userData.userId}
    cloudinary.uploads(path, 'Products')
        .then(response => {
            const product = new Product({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name,
                price: req.body.price,
                creationDate: Date.now(),
                category: req.body.category,
                description: req.body.description,
                imagePath: response.url,
                cloudinaryId: response.id,
                postedBy: user
            });

            product.save()
                .then(() => {
                    res.status(201).json({
                        message: 'product has been created successfully'
                    })
                    fs.unlinkSync(path)
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    })
                })
        })
        .catch(err=>{console.log(err)})
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
        .populate('postedBy')
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