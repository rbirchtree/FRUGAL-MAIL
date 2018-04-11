'use strict';
const  express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

const {Mail} = require('./models');

const router = express.Router();

const jsonParser = bodyParser.json();
/*removed jsonParser*/
//might need to change the router name
router.post('/', jsonParser,(req,res) => {
	console.log("accessing mail router")
	const requiredFields = ['description','toWhere','fromWhere','tripDate','mailingTravelingStatus','username','mailingAddress'];
	const missingField = requiredFields.find(field => !(field in req.body));
	
	if (missingField){
		console.log("accessing missingField")
		return res.status(422).json({
			code:422,
			reason: 'ValidationError',
			message: 'Missing field',
			location: missingField
		});
	}
	console.log("before mail create");

	return Mail.create({
		description: req.body.description,
		toWhere: req.body.toWhere,
		fromWhere: req.body.fromWhere,
		tripDate: req.body.tripDate,
		mailingTravelingStatus: req.body.mailingTravelingStatus = false,
		username: req.body.username,
		mailingAddress: req.body.mailingAddress
	}).then(postal => {return res.status(201)})
	.catch(err => {
		console.error(err);
		return res.status(500);
	});

/*	return Mail.create({
		description: req.body.description,
		toWhere: req.body.toWhere,
		fromWhere: req.body.fromWhere,
		tripDate: req.body.tripDate,
		mailingTravelingStatus: req.body.mailingTravelingStatus = false,
		username: req.body.username,
		mailingAddress: req.body.mailingAddress
	})
	.then
	(postal => {
		console.log("accessing 201")
		return res.status(201)})
	//do returns work  .then((data) => {})
	.catch(err =>{
		console.log("error promise")
		return res.status(500).json({error:'Something went wrong'});
//		.then((data) => { })

	});
	res.status(201)*/
});

router.delete('/:id',(req,res) => {
	Mail
	.findByIdAndRemove(req.params.id)
	.then(() => {
		res.status(204).json({message:'success'});
	})
	.catch(err => {
		console.error(err);
		res.status(500)
	});
});

module.exports = {router};
