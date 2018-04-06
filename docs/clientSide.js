$(function(){
	$('.register').submit(event => {
		event.preventDefault();
		const loginName = $(event.currentTarget).find('#username').val();
		const pwd = $(event.currentTarget).find('#password').val();
		const givenName = $(event.currentTarget).find('#firstName').val();
		const familyName = $(event.currentTarget).find('#lastName').val();
		//submit via ajax to the port
		createLogin(loginName,pwd, givenName, familyName);
	});
});

function createLogin(loginName,pwd, givenName, familyName){
	const userInfo = JSON.stringify({username: loginName, password: pwd, firstName: givenName, lastName: familyName});
	$.ajax({
		method: "POST",
		url: "api/users",
		data:userInfo
		//stringify?
	})
	.done(function(msg){
		alert('data saved');
	});
}
