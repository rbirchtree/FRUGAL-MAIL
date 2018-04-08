$(function(){
	let registerStatus = false;
	let loginStatus = false;
	let currentUser
	$('.register').submit(event => {
		event.preventDefault();
		const loginName = $(event.currentTarget).find('#username').val();
		const pwd = $(event.currentTarget).find('#password').val();
		const givenName = $(event.currentTarget).find('#firstName').val();
		const familyName = $(event.currentTarget).find('#lastName').val();
		//submit via ajax to the port
		
		createLogin(loginName,pwd, givenName, familyName);
		hideLogins();
	});
	$('.login').submit(event => {
		event.preventDefault();
		const userName = $(event.currentTarget).find('#loginName').val();
		const password = $(event.currentTarget).find('#loginPassword').val();
		
		login(userName,password);
		currentUser = userName;
		//submit via ajax to the port
		//create cookie here chain function
	});
	$('.addTrip').submit(event => {
		event.preventDefault();
		const mailingTraveling = String($("#mailingTraveling option:selected").text());
		const addTripTo = $(event.currentTarget).find('#addTripTo').val();
		const addTripFrom = $(event.currentTarget).find('#addTripFrom').val();
		const addMailingAddress = $(event.currentTarget).find('#addTripMailingAddress').val();
		const addTripBackStory = $(event.currentTarget).find('#addTripBackStory').val();
		const addTripDate = $(event.currentTarget).find('#addTripDate').val();
		createShippingRequest(currentUser,mailingTraveling, addTripTo, addTripFrom, addMailingAddress, addTripBackStory, addTripDate);
		//test write javascript for datbase to handle post requests
	});
});

function createShippingRequest(currentUser,mailingTraveling, addTripTo, addTripFrom, addMailingAddress, addTripBackStory, addTripDate){
	let shipData = JSON.stringify({username: currentUser, mailingTravelingStatus: mailingTraveling, toWhere:addTripTo, fromWhere: addTripFrom, mailingAddress: addMailingAddress, description: addTripBackStory, tripDate :addTripDate});
	///build a route for handling ship data to database

	$.ajax({
		type: "POST",
		url: "api/protected",
		data: shipData,
		headers: {
			'content-type': 'application/json'
		},
		/*beforeSend: function(xhr){
			xhr.setRequestHeader("Authorization", 'Bearer' + jwt);
		talk to ford about }*/ 
	}).done(function(response){
		alert("success");
	}).fail(function(err){
		alert("fail")
	});
	//https://stackoverflow.com/questions/42286781/jwt-token-with-ajax-non-ajax-jquery
}

function login(userName, password){
	const userInfo = JSON.stringify({username: userName, password: password });
	console.log(userInfo);
	$.ajax({
		method: "POST",
		url: "api/auth/login",
		data:userInfo,
		headers: {
            'content-type': 'application/json'
        }
	})
	//authtoken is sent automatically via route//now show protect api
	.done(function(msg){
		alert('data saved');
	});
	hideLogins();
}

function hideLogins(){
	//use bang operatos later work on routes
	$('.register').hide();	
	$('.login').hide();
	//show menu
}

function createLogin(loginName,pwd, givenName, familyName){
	const userInfo = JSON.stringify({username: loginName, password: pwd, firstName: givenName, lastName: familyName});
	console.log(userInfo)
	$.ajax({
		method: "POST",
		url: "api/users",
		data:userInfo,
		headers: {
            'content-type': 'application/json'
        }
		//stringify?
	})
	.done(function(msg){
		alert('data saved');
	});
}
