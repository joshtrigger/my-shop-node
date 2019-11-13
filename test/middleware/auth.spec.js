/* eslint-disable no-undef */
const expect = require('chai').expect;
const authenticate = require('../../api/middleware/authenticate');

describe('Authenticate()', () => {
    it('should fail on authentication attempt', () => {
        const req = {
            headers: {
                authorization: 'Bearer 12nnfieijri2'
            }
        }
        const res = {
            status: function (s) {
                this.status = s
                return this;
            },
            json: function () {
                return this;
            }
        }
        authenticate(req, res)
        expect(res.status).to.be.equal(401);
    })
    it('should authenticate successfully', () => {
        
    })
});