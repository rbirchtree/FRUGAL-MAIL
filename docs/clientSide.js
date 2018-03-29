$(function(){
	$('.login').submit(event => {
		event.preventDefault();
		const loginName = $(event.currentTarget).find('#username').val();
		const pwd = $(event.currentTarget).find('#password').val();
		//submit via ajax to the port
		createLogin(loginName,pwd)
	});
});

function createLogin(loginName,pwd){
	$.ajax({
		method: "POST",
		url: "/users",
		data:{username: loginName, password: pwd}
	})
	.done(function(msg){
		alert('data saved')
	})
}