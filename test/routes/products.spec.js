const request = require('supertest');
const productRoutes = require('../../api/routes/products');
const chai = require('chai');
// const chaiAsPromised = require('chai-as-promised');
// chai.use(chaiAsPromised);

describe('Product routes', function () {
    it('should get all products', function (done) {
        request(productRoutes)
            .get('/')
            .set('Accept', '*/*')
            .expect(200)
            .then(result => {
                console.log(res)
                done()
            })
            .catch(err => {
                console.log('error thrown', err)
                done(err)
            })
    })
})