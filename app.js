const express = require('express')
const morgan = require('morgan')
const app = express();
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

const productsRoutes = require('./api/routes/products')
const ordersRoutes = require('./api/routes/orders')

mongoose.connect('mongodb://localhost:27017/my-shop',{ useNewUrlParser: true });

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','*')
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT,POST,DELETE,PATCH,GET')
        return res.status(200).json({})
    }
    next();
});

app.use('/products', productsRoutes)
app.use('/orders', ordersRoutes)

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error)
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;
