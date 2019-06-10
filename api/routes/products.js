const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const mongoose = require('mongoose');
const auth = require('../middleware/authenticate');

router.get('/', (req, res, next) => {
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
            res.status(500).json({error: err})
        })
});

router.post('/', auth, (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        creationDate: Date.now()
    });

    product.save()
        .then(() => {
            res.status(201).json({
                message: 'product has been created successfully'
            })
        })
        .catch(err => {
            res.status(500).json({error: err})
        })
});

router.delete('/:productId', auth, (req, res, next) => {
    const id = req.params.productId;
    Product.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: `product of id ${id} has been deleted`
            })
        })
        .catch(err => {
            res.status(500).json({error: err})
        });
});

router.put('/:productId', auth, (req, res, next) => {
    const id = req.params.productId;
    Product.update({_id: id}, {$set: req.body})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'product has been successfully updated',
            })
        })
        .catch(err => {
            res.status(500).json({error: err})
        });
});

router.get('/:productId', (req, res, next) => {
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
            res.status(500).json({error: err})
        })
});

module.exports = router;
