const express = require('express');
const router = express.Router()

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'it got the products'
    })
})

router.post('/', (req, res, next) => {
    res.status(201).json({
        message: 'product has been created'
    })
})

router.delete('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'product has been deleted'
    })
})

router.put('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'product has been updated'
    })
})

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId
    if(id==='joshua'){
        res.status(200).json({
            message: `details for order ${id}`
        })
    }else{
        res.status(400).json({
            error: {
                body: 'this product does not exist'
            }
        })
    }
})

module.exports = router;