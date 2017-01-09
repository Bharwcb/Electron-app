// manages .env file
require('dotenv').load();

var Classy = require('classy-node');

var classy = new Classy({
	baseUrl: 'https://stagingapi.stayclassy.org',
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET
});

const app = classy.app();

app.then(function() {

	classy.campaigns.retrieve(72, {
		token: 'app'
	})

	.then(function(response) {
		console.log("RESPONSE: " + response.id);
	})

	.catch(function(error) {
		console.log("ERROR: " + error);
	});

});