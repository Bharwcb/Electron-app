// manages .env file
require('dotenv').load();

var Classy = require('classy-node');

var classy = new Classy({
	baseUrl: 'https://stagingapi.stayclassy.org',
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET
});

classy.app().then(function() {
	console.log("test");
});