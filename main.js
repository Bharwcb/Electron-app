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
// used to collect list of contact IDs, title, or whatever you are fetching. then, write to csv.
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

		for (i = 0; i < response.data.length; i++) {
			// formatting in the way fast-csv wants it to put each data point in a new row..
			classy_data.push(new Array(response.data[i].member_id.toString()));

			console.log("CLASSY_DATA: ", classy_data)
		}

		csv
			.write( classy_data, {headers: true})
			.pipe(ws);

	})

	.catch(function(error) {
		console.log("ERROR: " + error);
	});

});



