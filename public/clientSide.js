$(function() {
	let registerStatus = false;
	let loginStatus = false; //validate with cookie status
	let currentUser;
	let mailID
	$('.choices').hide();
	$('.addTrip').hide();
	$('.tripResults').hide();

	$('.register').submit(event => {
		event.preventDefault();
		let loginInfo = {
		username : $(event.currentTarget).find('#username').val(),
		password : $(event.currentTarget).find('#password').val(),
		firstName : $(event.currentTarget).find('#firstName').val(),
		lastName : $(event.currentTarget).find('#lastName').val(),
		};
		createLogin(loginInfo);
		
		('.login').show();

	});

	$('.login').submit(event => {
		event.preventDefault();
		const userName = $(event.currentTarget).find('#loginName').val();
		const password = $(event.currentTarget).find('#loginPassword').val();
		$('.login').hide();
		$('.register').hide();
		$('.choices').show();
		login(userName,password);
		currentUser = userName;
	});

	$('#addTripButton').click(function() {
		$('.addTrip').show();
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
		return searchMail();
	});


	$('#searchTripsButton').click(function()   {
		console.log("working")
		$('.tripResults').show();
		return searchMail();
	});

	$('.tripResults').on('click','.deletePost', function(event) {
			event.preventDefault();
			mailID = $(this).closest('li').attr('data-id');
			deleteMail(mailID);
			return searchMail();	
		//render list?
		});
	$('.tripResults').on('click','#updateMail', function(event){
		event.preventDefault();
		let trip = {
			description : $(event.currentTarget).parents().find('#addTripBackStory2').val(),
			toWhere : $(event.currentTarget).parents().find('#addTripTo2').val(),
			fromWhere : $(event.currentTarget).parents().find('#addTripFrom2').val(),
			tripDate : $(event.currentTarget).parents().find('#addTripDate2').val(),
			mailingTravelingStatus : String($("#mailingTraveling2 option:selected").text()),
			mailingAddress : $(event.currentTarget).parents().find('#addTripMailingAddress2').val(),
			username: currentUser			
		};
		
		updateMail(mailID,trip);
		return searchMail();
	});
	$('.tripResults').on('click','.updateTrip', function(event) {
		event.preventDefault();
		mailID = $(this).closest('li').attr('data-id');
		
		searchMailGetUpadate(mailID);
		
	});

	function createShippingRequest(trip) {
		let token = localStorage.getItem("authToken");
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
				$('.tripResults').empty();
				if(data.length >= 0){
				$.each(data, function(i){
					/*debugger;	data-id*/
					 $('.tripResults').append(`<li data-id="${data[i]._id}"> <b>To:</b> ${data[i].toWhere} <br><b>From:</b> ${data[i].fromWhere}<br><b>Trip Date:</b> ${data[i].tripDate} 
					 	<br><b>Status:</b> ${data[i].mailingTravelingStatus}<br><b>Story:</b> ${data[i].description}<br><b>Address:</b> ${data[i].mailingAddress}
					  <button class="deletePost">Delete</button><button class="updateTrip">Update</button></li>`);
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
			return $('.tripResults').html(`<h2>Are You Mailing or Traveling Overseas?</h2>
				<select name="status" id="mailingTraveling2" required>
					<option value="1">Traveling</option>
					<option value="2">Mailing</option>
				</select>
				<br>
				<label>Trip Date</label>
				<input id="addTripDate2" placeholder="${data.tripDate}"></input>
				<br>
				<label>From</label>
					<input id="addTripFrom2" placeholder="${data.fromWhere}"></input>
				<label>To</label>
				<br>
					<input id="addTripTo2" placeholder="${data.toWhere}"></input>
				<br>
					<label>Mailing Address</label>
						<textarea id="addTripMailingAddress2" rows="5" cols="30" name="address">${data.mailingAddress}</textarea>
					<label>Description of Trip/Mail</label>
						<textarea rows="5" cols="30" name="description" id="addTripBackStory2">${data.description}</textarea> 
				<br>
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
			
		});
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

	}


});