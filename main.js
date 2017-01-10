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
		// response is an array of JSON transaction data
    console.log("RESPONSE: ", response);

    var ws = fs.createWriteStream('./test.csv');
		// !! How to save file to user's desktop instead?

		// Matt, thoughts on this? 
		for (i = 0; i < response.data.length; i++) {
			// csv
			// 	.write([
			// 		["Contact ID", response.data[i].member_id]
			// 		], {headers:true})
			// 	.pipe(ws);
			console.log("I: ", i);
			console.log("MEMBER ID: ", response.data[i].member_id);
			// spitting out only member id 2619609
		}

	})

	.catch(function(error) {
		console.log("ERROR: " + error);
	});

});



