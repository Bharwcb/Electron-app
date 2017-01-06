// manages .env file
require('dotenv').load();

var Classy = require('classy-node');

console.log(process.env.CLIENT_ID);

var classy = new Classy({
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET
});

