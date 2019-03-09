$(function() {
	let currentUser;
	let mailID;
	$('#logout').css('visibility','hidden');
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
		$('.login').show();
		$('.register').hide();

	});

	$('.login').submit(event => {
		event.preventDefault();
		const userName = $(event.currentTarget).find('#loginName').val();
		const password = $(event.currentTarget).find('#loginPassword').val();
		$('.login').hide();
		$('.demo').hide();
		$('.register').hide();
		$('.choices').show();
		$('#logout').show();
		login(userName,password);
		currentUser = userName;
	});

	$('#addTripButton').click(function() {
		$('.addTrip').show();
		$('.tripResults').hide();
	});
	$('.demo').click(function(event){
		event.preventDefault();
		$('.login').hide();
		$('.register').hide();
		$('.choices').show();
	});
	$('.addTrip').submit(event => {
		event.preventDefault();
		let trip = {
			description : $(event.currentTarget).find('#addTripBackStory').val(),
			toWhere : $(event.currentTarget).find('#addTripTo').val(),
			fromWhere : $(event.currentTarget).find('#addTripFrom').val(),
			tripDate : $(event.currentTarget).find('#addTripDate').val(),
			mailingTravelingStatus : String($('#mailingTraveling option:selected').text()),
			mailingAddress : $(event.currentTarget).find('#addTripMailingAddress').val(),
			username: currentUser			
		};
		createShippingRequest(trip);
		$('.addTrip').hide();
			searchMail();
		$('.tripResults').show();
		 
	});
	$('#cancel').on('click', function(event){
		event.preventDefault();
		$('.choices').show();
		$('.tripResults').hide();
		$('.addTrip').hide();
	});

	$('.tripResults').on('click','.cancel', function(event){
		event.preventDefault();
		return searchMail();
	})

	$('#searchTripsButton').click(function()   {
		$('.addTrip').hide();
		$('.tripResults').show();
		return searchMail();
	});

	$('.tripResults').on('click','.deletePost', function(event) {
			event.preventDefault();
			mailID = $(this).closest('li').attr('data-id');
			deleteMail(mailID);
			return searchMail();	
		});
	$('.tripResults').on('click','#updateMail', function(event){
		event.preventDefault();
		let trip = {
			description : $(event.currentTarget).parents().find('#addTripBackStory2').val(),
			toWhere : $(event.currentTarget).parents().find('#addTripTo2').val(),
			fromWhere : $(event.currentTarget).parents().find('#addTripFrom2').val(),
			tripDate : $(event.currentTarget).parents().find('#addTripDate2').val(),
			mailingTravelingStatus : String($('#mailingTraveling2 option:selected').text()),
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
		let token = localStorage.getItem('authToken');
		$.ajax({
			type: 'POST',
			url: 'newmail',
			data: JSON.stringify(trip),
			headers: {
				'Authorization': `Bearer ${token}`,
				'content-type': 'application/json'
			}
		}).done(function(response) {
		}).fail(function(err){
		});
	}

	function updateMail(mailID, trip){
		
		let token = localStorage.getItem('authToken');
		$.ajax({
			type: 'PUT',
			url: `newmail/${mailID}`,
			data: JSON.stringify(trip),
			headers:{
				'Authorization': `Bearer ${token}`,
				'content-type' :'application/json'
			}
		}).done(function(response){
		}).fail(function(err){
		});
	}

	function deleteMail(mailID){
		let token = localStorage.getItem('authToken');
		$.ajax({
			type: 'DELETE',
			url: `newmail/${mailID}` ,
			headers:{
				'Authorization': `Bearer ${token}`,
				'content-type' :'application/json'
			}
		}).done(function(response){
		}).fail(function(err){
		});
	}


	function searchMail(){
		let token = localStorage.getItem('authToken');
		$.ajax({
			type: 'GET',
			url: 'newmail',
			datatype: 'json',
			headers:{
				'Authorization':`Bearer ${token}`,
				'content-type' : 'application/json'
			},
			success: function(data){
				$('.tripResults').empty();
				if(data.length >= 0){
					let j = 0;
				$.each(data, function(i){
					j =	j + 1
					 $('.tripResults').append(`<li data-id='${data[i]._id}'><b># ${j}</b> <br><b>To:</b> ${data[i].toWhere} <br><b>From:</b> ${data[i].fromWhere}<br><b>Trip Date:</b> ${data[i].tripDate} 
					 	<br><b>Status:</b> ${data[i].mailingTravelingStatus}<br><b>Story:</b> ${data[i].description}<br><b>Address:</b> ${data[i].mailingAddress}
					  <div class='stack'>
					  <button class='deletePost'>Delete</button><button class='updateTrip'>Update</button></div></li>`);
					//append data length of data + total length to create scroll
					/*add functions to update and delete//delete just a click button (which is appended and
					listens to clicks on id) to delete which is an ajax call to delete...update...selects the data*/
				});
				} else {
					return $('.tripResults').append('<p>nothing to see here</p>');
				}
			}
		}).done(function(response){
		}).fail(function(err){
		});
	}

	function searchMailGetUpadate(mailID){
		let token = localStorage.getItem('authToken');
		$.ajax({
			type: 'GET',
			url: `newmail/${mailID}`,
			datatype: 'json',
			headers:{
				'Authorization': `Bearer ${token}`,
				'content-type' :'application/json'
			},
		success: function(data){
	
			return $('.tripResults').html(`<h2>Are You Mailing or Traveling Overseas?</h2>
				<select name='status' id='mailingTraveling2' required>
					<option value='1'>Traveling</option>
					<option value='2'>Mailing</option>
				</select>
				<br>
				<label for='addTripDate2'>Trip Date</label>
				<input id='addTripDate2' placeholder='${data.tripDate}'></input>
				<br>
				<label for='addTripFrom2'>From</label>
				<input id='addTripFrom2' placeholder='${data.fromWhere}'></input>
				<br>
				<label for='addTripTo2'>To</label>
				<input id='addTripTo2' placeholder='${data.toWhere}'></input>
				<br>
				<label for='addTripMailingAddress2'>Mailing Address</label>
				<textarea id='addTripMailingAddress2' rows='5' cols='30' name='address'>${data.mailingAddress}</textarea>
				<br>
				<label for='addTripBackStory2'>Description of Trip/Mail</label>
				<textarea rows='5' cols='30' name='description' id='addTripBackStory2'>${data.description}</textarea> 
				<br>
				<div class='stack'>
				<button id='updateMail' type='submit'>Update Trip</button>
				<button class='cancel' type='submit'>Cancel</button>
				</div>`
				);
		}
		});
	};

	function login(userName, password) {
		const userInfo = JSON.stringify({username: userName, password: password });
		$.ajax({
			method: 'POST',
			url: 'api/auth/login',
			data: userInfo,
			headers: {
	      'content-type': 'application/json'
	    },
	    failure: function(response){
	    	
	    },
	    success: function(response){
	    }
		})
		.done(function(msg) {
			localStorage.setItem('authToken', msg.authToken);
			$('#logout').css('visibility','visible');
		});

	}

	function createLogin(loginInfo) {

		const userInfo = JSON.stringify(loginInfo);
		$.ajax({
			method: 'POST',
			url: 'api/users',
			data: userInfo,
			headers: {
	      'content-type': 'application/json'
	    			}
		})
		.done(function(msg) {
		});

	}

	function logout(){
		$.ajax({
			method: 'GET',
			url: 'logout',
		}).done(function(data){
			$('#logout').hide();
		});
	}

	$.ajaxSetup({
		statusCode: {
			401: function(){
				location.href ='/logout'
			}
		}
	})
;
});