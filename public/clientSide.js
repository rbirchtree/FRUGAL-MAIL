$(function() {
	let registerStatus = false;
	let loginStatus = false; //validate with cookie status
	let currentUser;

	$('.register').submit(event => {
		event.preventDefault();
		let loginInfo = {
		username : $(event.currentTarget).find('#username').val(),
		password : $(event.currentTarget).find('#password').val(),
		firstName : $(event.currentTarget).find('#firstName').val(),
		lastName : $(event.currentTarget).find('#lastName').val(),
		//submit via ajax to the port
		};
		createLogin(loginInfo);
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
		let trip = {
			description : $(event.currentTarget).find('#addTripBackStory').val(),
			toWhere : $(event.currentTarget).find('#addTripTo').val(),
			fromWhere : $(event.currentTarget).find('#addTripFrom').val(),
			tripDate : $(event.currentTarget).find('#addTripDate').val(),
			mailingTravelingStatus : String($("#mailingTraveling option:selected").text()),
			mailingAddress : $(event.currentTarget).find('#addTripMailingAddress').val(),
			username: currentUser			
		};

		createShippingRequest(trip);
		//test write javascript for datbase to handle post requests
	});
});

function createShippingRequest(trip) {
	///build a route for handling ship data to database
	let token = localStorage.getItem("authToken");
	validToken(token);
	$.ajax({
		type: "POST",
		url: "newmail",
		data: JSON.stringify(trip),
		headers: {
			'Authorization': `Bearer ${token}`,
			'content-type': 'application/json'
		}
		/* removed commona on line above beforeSend: function(xhr){
			xhr.setRequestHeader("Authorization", 'Bearer' + jwt);
		talk to ford about }*/ 
	}).done(function(response) {
		console.log("trip posted to database");
		//reset
	}).fail(function(err){
		console.log("Did not add trip to database");
	});
}

function updateMail(){
	let token = localStorage.getItem("authToken");
	$.ajax({
		type: "PUT",
		url: "newmail",
		data: JSON.stringify(trip),
		headers:{
			'Authorization': `Bearer ${token}`,
			'content-type' :'application/json'
		}
	}).done(function(response){
		console.log('updated trip in database')
	}).fail(function(err){
		console.log('did not update trip in database');
	})
}

function deleteMail(){
	let token = localStorage.getItem("authtoken");
	$.ajax({
		type: "DELETE",
		url: "newmail",
		/*data: id??? from query sellector*/
		headers:{
			'Authorization': `Bearer ${token}`,
			'content-type' :'application/json'
		}
	}).done(function(response){
		console.log("trip was deleted")
	}).fail(function(err){
		console.log('trip was not deleted');
	});
}

function searchMail(){
	let token = localStorage.getItem("authToken");
	$.ajax({
		type: "GET",
		url: "newmail",
		headers:{
			'Authorization':`Bearer ${token}`,
			'content-type' : 'application/json'
		},
		success: function(data){
			console.log(data)
		}
	}).done(function(response){
		console.log("search success");
	}).fail(function(err){
		console.log(err);
	});
}

function login(userName, password) {
	const userInfo = JSON.stringify({username: userName, password: password });
	console.log(userInfo);
	$.ajax({
		method: "POST",
		url: "api/auth/login",
		data: userInfo,
		headers: {
      'content-type': 'application/json'
    }
	})
	//authtoken is sent automatically via route//now show protect api
	.done(function(msg) {
		localStorage.setItem('authToken', msg.authToken);
		hideLogins();
	});
}

function hideLogins() {
	//use bang operaters later work on routes
	$('.register').hide();	
	$('.login').hide();
	//show menu
}



function createLogin(loginInfo) {
	const userInfo = JSON.stringify(loginInfo);
	console.log(userInfo);
	$.ajax({
		method: "POST",
		url: "api/users",
		data:userInfo,
		headers: {
      'content-type': 'application/json'
    }
		//stringify?
	})
	.done(function(msg) {
		console.log('data saved');
	});
}

function validToken(token){
	if (token){
		loginStatus = true;
		alert(token," exist")
		hideLogins();
	}
	alert("token doesn't exist")
}
