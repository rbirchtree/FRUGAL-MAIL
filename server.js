const express = require('express');
const app = express();

app.use(express.static('docs'));

app.get('/',(req,res) => {
	//how to redirect any url
	res.sendFile(__dirname +`/docs/index.html`);
	//res.sendFile("/index.html");
});
app.get('/about',(req,res) => {
	//how to redirect any url
	res.sendFile(__dirname +`/docs/about.html`);
	//res.sendFile(__dirname"/about.html");
});

/*app.listen(process.env.PORT || 8080, () =>{
	console.log(`Listening on port 8080`);
});
*/
let server;

function runServer(){
	const port = process.env.PORT || 8080;
	return new Promise((resolve, reject) =>{
		server = app.listen(port, () => {
			console.log(`Your app is listening on port  ${port}`);
			resolve(server);
		}).on('error',err => {
			reject(err);
		});
	});
}

function closeServer(){
	return new Promise((resolve, reject) => {
		console.log('Closing server');
		server.close(err => {
			//wtf server.close?
			if(err){
				reject(err);
				return;
			}
			resolve();
		});
	});
}

app.listen(8080,function(){
	console.log('App listening on port 8080!')
});
/*if (require.main === module) {
	runServer().catch(err => console.error(err));
};*/
//what??
module.exports = {app, runServer, closeServer};