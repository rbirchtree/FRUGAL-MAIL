const chai = require('chai');
const chaiHttp = require('chai-http');
//let randNum = String(Math.random());
const faker = require('faker');
const {app, runServer, closeServer} = require('../server');

const expect = chai.expect;
const should = chai.should();
const chaiHtml = require('chai-html');
const mongoose = require('mongoose');

const {Mail} = require('../mail/models');
const {User} = require('../users/models');
const {TEST_DAATABASE_URL} = require('../config');

chai.use(chaiHttp);

function generateUser(){
	return {
		username: faker.internet.userName(),
		password: faker.internet.password(),
		firstName: faker.name.firstName(),
		lastName: faker.name.lastName()
	};
}

function generateLogin(){
	return {
		username: faker.internet.userName(),
		password: faker.internet.password()
	};
}

function randomTravelMailingStatus(){
	const status = Math.random();
	if (status > .5) {
		return "Traveling";
	} else {
		return "Mailing";
	}
}

function generateMail(){
	return {
		description: faker.lorem.text(),
		toWhere: faker.address.city() + ' , '+ faker.address.state(),
		fromWhere: faker.address.city() +' , '+ faker.address.state(),
		tripDate: faker.date.future(),
		mailingTravelingStatus: randomTravelMailingStatus(),
		mailingAddress: faker.address.city() +' , ' +faker.address.state(),
		username: faker.internet.userName(),
	};
};


//console.log(generateUser());
//console.log(generateLogin());
//console.log(generateMail());

describe('Frugal-Mail CRUD points', function(){

	before(function(){
		return runServer();
	});

	after(function(){
		return closeServer();
	});

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

	it('should get about page', function(){
		return chai.request(app)
		.get('/about')
		.then(res => {
			res.should.have.status(203);
		});
	});

	it('should get logout', function(){
		return chai.request(app)
		.get('/logout')
		.then(res => {
			res.should.have.status(200);
		});
	});

	it('should add a new user', function(){
		let newUser = generateUser();
		let res;
		return chai.request(app)
		.post('/api/users/')
		.send(newUser)
		.then(function(res){
			 res.should.have.status(201)
			 res.should.be.json;
		}).catch(function(err){
			 err;
		});
	});
	

});