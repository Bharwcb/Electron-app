// manages .env file
require('dotenv').load();

var Classy = require('classy-node');
var fs = require('fs');
var csv = require('fast-csv');

var classy = new Classy({
	baseUrl: 'https://stagingapi.stayclassy.org',
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET
});

const app = classy.app();

app.then(function() {

	// First, loop through all transactions (with sample time filter)
	classy.organizations.listTransactions(34, {
		token: 'app',
		filter: 'purchased_at>2017-01-01T10:00:00'
	})

	.then(function(response) {
		// response should be an array of JSON transaction data
    console.log("RESPONSE: ", response);
	})

	.catch(function(error) {
		console.log("ERROR: " + error);
	});

});

// var ws = fs.createWriteStream('./test.csv');
// // !! How to save file to user's desktop instead?

// csv
// 	.write([
// 		["a1", "b1"],
// 		["b2", "c2"],
// 		["c2", "d2"],
// 		["d"]
// 		], {headers:true})
// 	.pipe(ws);

