'use strict';
const  express = require('express');
const bodyParser = require('body-parser');

const {Mail} = require('./models');

const router = express.Router();

const jsonParser = bodyParser.json();

//might need to change the router name
router.post('/', jsonParser, (req,res) =>{
	const requiredFields = ['description','toWhere','fromWhere','tripDate','mailingTravelingStatus','username','mailingAddress'];
	const missingField = requiredFields.find(field => !(field in req.body));
	
	if (missingField){
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
		mailingTravelingStatus: req.body.mailingTravelingStatus = false,
		username: req.body.username,
		mailingAddress: req.body.mailingAddress
	})
	.then(postal => res.status(201))
	.catch(err =>{
		res.status(500).json({error:'Something went wrong'});
	});
});
