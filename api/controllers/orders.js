const Order = require('../models/order');
const Product = require('../models/product');
const mongoose = require('mongoose');

const getAllOrders = (req, res, next) => {
    Order.find()
        .exec()
        .then(result => {
            if (result.length === 0) {
                res.status(200).json({
                    message: 'No orders available'
                })
            } else {
                res.status(200).json(result)
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

const addNewOrder = (req, res, next) => {
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        product: req.body.productId,
        quantity: req.body.quantity,
        creationDate: Date.now()
    });

    Product.findById({
            _id: req.body.productId
        }).exec()
        .then(result => {
            if (result) {
                order.save()
                    .then(data => {
                        res.status(201).json({
                            message: 'order has been made',
                            order: {
                                id: data._id,
                                quantity: data.quality,
                                product: result,
                                createdOn: data.creationDate
                            }
                        })
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: err
                        })
                    });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })

}

const getSpecificOrder = (req, res, next) => {
    const id = req.params.orderId
    Order.findById({
            _id: id
        }).exec()
        .then(result => {
            if (result) {
                res.status(200).json(result)
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        })
}

const deleteOrder = (req, res, next) => {
    const id = req.params.orderId;
    Order.remove({
            _id: id
        }).exec()
        .then(() => {
            res.status(200).json({
                message: `order ${id} has been deleted`
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

module.exports = {
    getAllOrders,
    getSpecificOrder,
    addNewOrder,
    deleteOrder
}