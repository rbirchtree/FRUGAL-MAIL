const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const expect = chai.expect;
const should = chai.should();
const chaiHtml = require('chai-html');

chai.use(chaiHttp);

describe('GET endpoint', function(){
	it('should return 200', function(){
		let res;
		return chai.request(app)
		.get('/')
		.then(_res =>{
			res = _res;
			//why did this work and not the other???
//			expect('<p>Hello World </p>').html.to.equal('<p>Hello World</p>');
			res.should.have.status(200);
		});
	});
});