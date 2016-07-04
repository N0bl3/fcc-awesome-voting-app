/* eslint-disable no-unused-vars */
const chai = require('chai');
const should = chai.should();
const routes = require('../routes/all');
/* eslint-enable no-unused-vars */

describe('routes', () => {
  it('has all routes', () => {
    routes.should.have.property('index');
  });
});
