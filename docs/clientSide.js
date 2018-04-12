$(function() {
	let registerStatus = false;
	let loginStatus = false;
	let currentUser

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
			currentUser,
			mailingTraveling : String($("#mailingTraveling option:selected").text()),
			toWhere : $(event.currentTarget).find('#addTripTo').val(),
			fromWhere : $(event.currentTarget).find('#addTripFrom').val(),
			mailingAddress : $(event.currentTarget).find('#addTripMailingAddress').val(),
			description : $(event.currentTarget).find('#addTripBackStory').val(),
			tripDate : $(event.currentTarget).find('#addTripDate').val()		
		};

		createShippingRequest(trip);
		//test write javascript for datbase to handle post requests
	});
});

function createShippingRequest(trip) {
	///build a route for handling ship data to database
	let token = localStorage.getItem("authToken");
	$.ajax({
		type: "POST",
		url: "newmail",
		data: JSON.stringify(trip),
		headers: {
			'Authorization': `Bearer ${token}`,
			'content-type': 'application/json'
		},
		/*beforeSend: function(xhr){
			xhr.setRequestHeader("Authorization", 'Bearer' + jwt);
		talk to ford about }*/ 
	}).done(function(response) {
		alert("success");
	}).fail(function(err){
		alert("fail")
	});
	//https://stackoverflow.com/questions/42286781/jwt-token-with-ajax-non-ajax-jquery
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
	});
	hideLogins();
}

function hideLogins() {
	//use bang operatos later work on routes
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
		alert('data saved');
	});
}
