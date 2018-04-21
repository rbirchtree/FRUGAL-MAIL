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


	$('#searchTripsButton').click(function()   {
		console.log("working")
		return searchMail();
	});

	// delete query here
	$('.tripResults').on('click','.deletePost', function(event) {
			event.preventDefault();
			//https://www.codehaven.co.uk/get-id-of-closest-div-or-li/
			const mailID = $(this).closest('li').attr('data-id');
			deleteMail(mailID);
			/*pass mail id to delete function*/
			//get value of data-id than delete it
/*			const itemIndex = $(event.target).closest('li').css('color','blue');
*/			//pass delete function
			//$(this).data("id");
			
		//closest? li
		//const deleteMail = $(event.currentTarget).find('#data-id').val()
		//render list?
		});
});

function getItemIndexFromElement(item) {
	const itemIndexString = $(item).closest('li').attr('data-id')
	console.log(itemIndexString);
	//value?
}

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

function updateMailDate(){
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

function deleteMail(mailID){
	let token = localStorage.getItem("authToken");
	console.log(mailID,'token',token);
	$.ajax({
		type: "DELETE",
		url: `newmail/${mailID}` ,
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
		datatype: "json",
		headers:{
			'Authorization':`Bearer ${token}`,
			'content-type' : 'application/json'
		},
		success: function(data){
			if(data.length >= 0){
			$.each(data, function(i){
				/*debugger;	data-id*/
				 $('.tripResults').append(`<li data-id="${data[i]._id}"> To: ${data[i].toWhere} From: ${data[i].fromWhere} Trip Date: ${data[i].tripDate} 
				 	Status: ${data[i].mailingTravelingStatus} Story: ${data[i].description} Address: ${data[i].mailingAddress}
				  <button class="deletePost">delete</button></li><button class="updateTripDate">Update Trip Date</button></li>`);
				 console.log(i,'this is i')

				//append data length of data + total length to create scroll
				/*add functions to update and delete//delete just a click button (which is appended and
				listens to clicks on id) to delete which is an ajax call to delete...update...selects the data
					*/
				return (i < 10);
			});
			} else {
				return $('.tripResults').append("<p>nothing to see here</p>");
			}
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
		registerStatus = true;
		loginStatus = true;
		hideLogins();
	});
}

function hideLogins() {
	//use bang operaters later work on routes
	if(registerStatus) {
		$('.register').hide();	
	}

	if(loginStatus) {
		$('.login').hide();
	}
}

function logout(){
	$.ajax({
		method: "GET",
		url: "logout",
	})
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
	registerStatus = true;
}

function validToken(token){
	if (token){
		loginStatus = true;
		alert(token," exist")
		hideLogins();
	}
	alert("token doesn't exist")
	//use for crud functions on mail
}
