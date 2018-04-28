const chai = require('chai');
const chaiHttp = require('chai-http');
//let randNum = String(Math.random());
const faker = require('faker');
const jwt = require('jsonwebtoken');
const {app, runServer, closeServer} = require('../server');

const expect = chai.expect;
const should = chai.should();
const chaiHtml = require('chai-html');
const mongoose = require('mongoose');
const { JWT_SECRET } = require('../config');
const {Mail} = require('../mail/models');
const {User} = require('../users/models');
const {TEST_DATABASE_URL} = require('../config');

mongoose.Promise = global.Promise;

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
		description: faker.lorem.sentence(),
		toWhere: faker.address.city() + ' , '+ faker.address.state(),
		fromWhere: faker.address.city() +' , '+ faker.address.state(),
		tripDate: faker.date.future(),
		mailingTravelingStatus: randomTravelMailingStatus(),
		mailingAddress: faker.address.city() +' , ' +faker.address.state(),
		username: faker.internet.userName(),
	};
};


describe('Frugal-Mail CRUD points', function(){

	const username = 'exampleUser';
	const password = 'examplePass';
	const firstName = 'Example';
	const lastName = 'User';

	before(function(){
		return runServer();
	});

	after(function(){
		return closeServer();
	});

	beforeEach(function() {
	    return User.hashPassword(password).then(password =>
	      User.create({
	        username,
	        password,
	        firstName,
	        lastName
	      })
	    );
	  });


	afterEach(function(){
		return User.remove({});
	});

	it('should return 200', function(){
		let res;
		return chai.request(app)
		.get('/')
		.then(res =>{
			//res = _res;
			res.should.have.status(200);
		});
	});

	it('should get about page', function(){
		return chai.request(app)
		.get('/about')
		.then(res => {
			res.should.have.status(203);
			expect(res).to.be.html;
		});
	});

	it('should get logout', function(){
		return chai.request(app)
		.get('/logout')
		.then(res => {
			res.should.have.status(200);
			expect(res).to.be.html;
		});
	});
/*
	it('Should return a valid auth token', function () {
      return chai
        .request(app)
        .post('/api/auth/login')
        .send({ username, password })
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          const token = res.body.authToken;
          expect(token).to.be.a('string');
          const payload = jwt.verify(token, JWT_SECRET, {
            algorithm: ['HS256']
          });
          expect(payload.user).to.deep.equal({
            username,
            firstName,
            lastName
          })
        });
    });*/

	//first post with token
	// make token global?
	//token might already be created or send login to get a token...?
	/*it('Should return a successful post of mail with token', function(){
		const postal = generateMail()

		const token = jwt.sign(
        {
          user: {
            username,
            firstName,
            lastName
          }
        },
        JWT_SECRET,
        {
          algorithm: 'HS256',
          subject: username,
          expiresIn: '7d'
        }
      );



		return chai.request(app)
			.post('/login')
			.send({
           username: 'lizardlad01',
           password: '322skulls'
			})
			.then((res) => {
				res.should.have.status(200);
				res.should.be.json;
				console.log(res.body);
				token = res.body.token
				return token;
			})
			.catch((err) =>{
				console.log('failed at user authentication');
			})
			.then((err, data) =>{
				console.log('token value is ', token);
				chai.request(app)
				.post('/newmail')
            	.set( 'Authorization', `${ token }` )
				.send(postal)
				.then(res => {
					console.log('second response is ', res);
					res.should.have.status(201)
				})
				.catch( err =>{
					console.log('second promise', err.message)
				})
			})

*/
          /*expect(payload.user).to.deep.equal({
            username,
            firstName,
            lastName
          });
          expect(payload.exp).to.be.at.least(decoded.exp);*/
       

			//line 219 work on delete put get
//	});
	//use auth token refresh
	//https://medium.com/@bill_broughton/testing-with-authenticated-routes-in-express-6fa9c4c335ca
});

