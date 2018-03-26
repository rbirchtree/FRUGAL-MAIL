
//need a seperate collections for users, trips, and ship requests
//https://docs.mongodb.com/manual/core/capped-collections/ cap max size
//db.createCollection("log", {capped: true, size: 4096})
var SHIP_MATCH_UPDATES = {	
	"shipRequests"	 : [
		{
			"shipRequestId": "1234",
	//uuid module? seperate table for user? //object id
			"courier": true,
	//true = courier false = mailer
			"from": "Los Angeles, CA",
	// use geolocatioapp translation???
			"to" : "Hong Kong, CH",
			"completedTrip": false,
			"backStory": "I'm going to Hong Kong to see in laws.",
			"when": "03/16/2018",
			"mailingAddress": "1337 Hacker Way, SF, CA, 90844",
			"userInfo" : {
				"user": "Rob",
				"pwd": "123#"
				//want users to log in for trip
				//uuid here?
			},
			"packagesRequest":[null,null,{"shipRequestId": "5555"}]
		},
		{
			"shipRequestId": "5555",
	//uuid module? seperate table for user?
			"courier": false,
	//true = courier false = mailer
			"from": "Los Angeles, CA",
			"to" : "Hong Kong, CH",
			//doesn't matter if mailing
			"completedTrip": false,
			"backStory": "Need original legal docs to get signed asap",
			"when": "03/16/2018",
			"mailingAddress": "1337 Hacker Way, SF, CA, 90844"
			//pay  feature add later?
			//match trip?
			,"userInfo" : {
				"user":"Billy",
				"pwd": "pwd"
			},
			"packagesRequest":[null,null,null]
		},
		{
			"shipRequestId": "7894",
			"courier":true,
			"from": "New York",
			"to": "Switzerland",
			"completedTrip": false,
			"backStory" : "Signing a LOI to do a LBO",
			"when": 05/21/2018,
			"mailingAddress": "1231 Avenue of America, NY,NY 21001, USA",
			//auto delete after a while?,
			"userInfo":{
				"user":"Bob",
				"pwd" : "5445"
			},
			"packagesRequest":[null,null,null]
		}
	]
};

function getRecentStatusUpdates(callbackFn){
	setTimeout(function(){ callbackFn(SHIP_MATCH_UPDATES)},1);
}

function displayStatusUpdates(data){
	for(index in data.shipRequests){
		//To: ${} From:${} When:${}
		$('.container').append(`<p><b>To: </b> ${data.shipRequests[index].to} <b>From:</b> ${data.shipRequests[index].from} <b>Backstory:</b> ${data.shipRequests[index].backStory}</p>`)
	}
}

function getAndDisplayStatusUpdates(){
	getRecentStatusUpdates(displayStatusUpdates);
}
//https://www.mongodb.com/blog/post/building-your-first-application-mongodb-creating-rest-api-using-mean-stack-part-1
//https://docs.mongodb.com/manual/tutorial/model-referenced-one-to-many-relationships-between-documents/ emd documents to create extra useres
//http://mongoosejs.com/docs/populate.html

$(function(){
	getAndDisplayStatusUpdates();
})
