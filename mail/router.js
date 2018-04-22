'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const {Mail} = require('./models');

const router = express.Router();

const jsonParser = bodyParser.json();
/*removed jsonParser*/
//might need to change the router name
router.use(jsonParser);

const jwtAuth = passport.authenticate('jwt', { session: false });

router.post('/', jwtAuth, (req,res) => {
	console.log("accessing mail router")
	const requiredFields = ['description','toWhere','fromWhere','tripDate',
													'mailingTravelingStatus','username','mailingAddress'];
	const missingField = requiredFields.find(field => !(field in req.body));
	
	if (missingField) {
		console.log("missingField access")
		return res.status(422).json({
			code:422,
			reason: 'ValidationError',
			message: 'Missing field',
			location: missingField
		});
	}
	Mail.create({
		description: req.body.description,
		toWhere: req.body.toWhere,
		fromWhere: req.body.fromWhere,
		tripDate: req.body.tripDate,
		mailingTravelingStatus: req.body.mailingTravelingStatus,
		username: req.body.username,
		mailingAddress: req.body.mailingAddress
	})
	.then(postal => {
		return res.status(201).json(postal).send();
	})
	.catch(err => {
		return res.status(500).json(err).send();
	});
});

router.delete('/:id',jwtAuth,(req,res) => {
	/*add jwtAuth might need to set-up up route to validate*/
	Mail
	.findByIdAndRemove(req.params.id)
	.then(() => {
		res.status(204).end();
	})
	.catch(err => {
		console.error(err);
		res.status(500)
	});
});

router.get('/',jwtAuth,function(req,res,next){
	/*add jwtAuth might need to set-up up route to validate*/
	Mail.find()
	.then(postal => {
		res.json(postal).end();
	}).catch( err => {
		console.error(err);
		res.status(500).json({error: 'something went terribly wrong'});
	});
});

router.put('/:id',jwtAuth,(req,res) => {
	const updated = {};
	const updateableFields = ['description','toWhere','fromWhere','tripDate',
													'mailingTravelingStatus','username','mailingAddress'];
		console.log(req.body)
	Mail.
		findByIdAndUpdate(req.params.id,
			{
				description: req.body.description,
				toWhere: req.body.toWhere,
				fromWhere: req.body.fromWhere,
				tripDate: req.body.tripDate,
				mailingTravelingStatus: req.body.mailingTravelingStatus,
				username: req.body.username,
				mailingAddress: req.body.mailingAddress
			})
		.then(postal => {
			res.json(postal).end();
		}).catch(err =>{
			res.status(500).json({error: 'something went terribly wrong'});
		})
});

router.get('/:id',jwtAuth,(req,res) =>{
	Mail.
		findByIdAndUpdate(req.params.id)
	.then(postal =>{
		res.json(postal).end();
	}).catch(err =>{
		res.status(500).json({error: 'something went really terribly wrong'});
	});
});

module.exports = {router};
