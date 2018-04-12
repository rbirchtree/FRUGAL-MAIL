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
		
		return res.status(422).json({
			code:422,
			reason: 'ValidationError',
			message: 'Missing field',
			location: missingField
		});
	}

	return Mail.create({
		description: req.body.description,
		toWhere: req.body.toWhere,
		fromWhere: req.body.fromWhere,
		tripDate: req.body.tripDate,
		mailingTravelingStatus: req.body.mailingTravelingStatus = false,
		username: req.body.username,
		mailingAddress: req.body.mailingAddress
	})
	Mail.create(req.body)
	.then(postal => {
		return res.status(201).json(postal);
	})
	.catch(err => {
		return res.status(500).json(err);
	});
});

router.delete('/:id',(req,res) => {
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

module.exports = {router};
