const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'orders have been fetched'
    })
})

router.post('/', (req, res, next) => {
    res.status(201).json({
        message: 'order has been created'
    })
})

router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId
    res.status(200).json({
        message: `order details for ${id}`
    })
})

router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId
    res.status(200).json({
        message: `order ${id} has been deleted`
    })
})

module.exports = router;
