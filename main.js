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

const headers = ["Contact ID", "Title"];
// used to collect list of contact IDs, title, and so on.. then write to CSV from array
let classy_data = [];

app.then(function() {

	// First, loop through all transactions (with sample time filter)
	classy.organizations.listTransactions(34, {
		token: 'app',
		filter: 'purchased_at>2017-01-01T10:00:00'
	})

	.then(function(response) {
		// response is an array of JSON transaction data
    console.log("RESPONSE: ", response);

    var ws = fs.createWriteStream('./result.csv');

    // remember to accomodate for blank string responses!  ignoreEmpty: true I think. might supposed to use .fromStream not write
		for (i = 0; i < response.data.length; i++) {
			classy_data.push(response.data[i].member_id);
			console.log("I: ", i);
			console.log("MEMBER ID: ", response.data[i].member_id);
			console.log("CLASSY_DATA: ", classy_data)
		}

		csv
			.write([ classy_data ], {headers: true})
			.pipe(ws);

	})

	.catch(function(error) {
		console.log("ERROR: " + error);
	});

});



