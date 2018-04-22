$(function() {
	let registerStatus = false;
	let loginStatus = false; //validate with cookie status
	let currentUser;
	let mailID
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
			mailID = $(this).closest('li').attr('data-id');
			deleteMail(mailID);
				
		//render list?
		});
	$('.tripResults').on('click','#updateMail', function(event){
		event.preventDefault();
		let trip = {
			description : $(event.currentTarget).find('#addTripBackStory2').val(),
			toWhere : $(event.currentTarget).find('#addTripTo2').val(),
			fromWhere : $(event.currentTarget).find('#addTripFrom2').val(),
			tripDate : $(event.currentTarget).find('#addTripDate2').val(),
			mailingTravelingStatus : String($("#mailingTraveling2 option:selected").text()),
			mailingAddress : $(event.currentTarget).find('#addTripMailingAddress2').val(),
			username: currentUser			
		};
		var element = document.getElementById('#addTripDate2');
		alert(element)
		alert(JSON.stringify(trip));
		console.log(mailID)
		updateMail(mailID,trip);
		//undefined?
	});
	//continue from here
	$('.tripResults').on('click','.updateTrip', function(event) {
		event.preventDefault();
		let mailID = $(this).closest('li').attr('data-id');
		//
		//get id and post return data in form //send put via
		searchMailGetUpadate(mailID)

		//updateMail(mailID,trip)
		//update function
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
		}).done(function(response) {
			console.log("trip posted to database");
			//reset
		}).fail(function(err){
			console.log("Did not add trip to database");
		});
	}

	function updateMail(mailID, trip){
		console.log(JSON.stringify(trip),"updatemail function");
		let token = localStorage.getItem("authToken");
		$.ajax({
			type: "PUT",
			url: `newmail/${mailID}`,
			data: JSON.stringify(trip),
			headers:{
				'Authorization': `Bearer ${token}`,
				'content-type' :'application/json'
			}
		}).done(function(response){
			console.log('updated trip in database')
		}).fail(function(err){
			console.log('did not update trip in database');
		});
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
					  <button class="deletePost">Delete</button><button class="updateTrip">Update Trip</button></li>`);
					//append data length of data + total length to create scroll
					/*add functions to update and delete//delete just a click button (which is appended and
					listens to clicks on id) to delete which is an ajax call to delete...update...selects the data*/
					return (i < 15);
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

	function searchMailGetUpadate(mailID){
		let token = localStorage.getItem("authToken");
		$.ajax({
			type: "GET",
			url: `newmail/${mailID}`,
			datatype: "json",
			headers:{
				'Authorization': `Bearer ${token}`,
				'content-type' :'application/json'
			},
		success: function(data){
			//const formData = JSON.stringify(data);
			//return $('.tripResults').append(JSON.stringify(data));
			//debugger;
			return $('.tripResults').html(`<h2>Are You Mailing or Traveling Overseas?</h2>
				<select name="status" id="mailingTraveling2" required>
					<option value="1">Traveling</option>
					<option value="2">Mailing</option>
				</select>
				<label>Trip Date</label>
				<input id="addTripDate2" placeholder="${data.tripDate}"></input>
				<label>From</label>
					<input id="addTripFrom2" placeholder="${data.fromWhere}"></input>
				<label>To</label>
					<input id="addTripTo2" placeholder="${data.toWhere}"></input>
				<div class="stack">
					<label>Mailing Address</label>
						<textarea id="addTripMailingAddress2" rows="5" cols="30" name="address">${data.mailingAddress}</textarea>
					<label>Description of Trip/Mail</label>
						<textarea rows="5" cols="30" name="description" id="addTripBackStory2">${data.description}</textarea> 
				</div>
				<button id="updateMail" type="submit">Update Trip</button>`);
		}
		});
	};

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
		});
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
		//alert("token doesn't exist")
		//use for crud functions on mail
	}
});