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

// one place to change headers for import
const csvHeaders = ["Contact ID", "Title"];

// used to collect list of contact IDs, title, or whatever you are fetching. then, write to csv.
let classyData = [];

app.then(function() {

	// First, loop through all transactions (with sample time filter)
	classy.organizations.listTransactions(34, {
		token: 'app',
		filter: 'purchased_at>2017-01-01T10:00:00'
	})

	.then(function(response) {
		// response is an array of JSON transaction data, 20 per page. Add the first page of responses to var classyData.
		var ws = fs.createWriteStream('./result.csv');
		console.log("PAGE 1");
		for (i = 0; i < response.data.length; i++) {
			console.log("I: ", i);
			console.log("TRANSACTION_ID: ", response.data[i].id);
			// formatting var classyData in the way fast-csv wants it to put each of 20 transactions row by row.. [[h1,h1], [r1,c1], [r2,c2]].
			classyData.push(new Array(response.data[i].member_id.toString()));
		}

		// When done with first page, find out how many pages total were in the response..
		const numberOfPages = response.last_page;
		let promises = [];

		// And request all remaining pages after the first page.
		// Add them to promises array to call all asynchronously
		// PROMISE IS GETTING ADDED, BUT NONE OF .THEN(FUNCTION(HIGHERPAGERESPONSES) IS RUNNING)
		for (page = 2; page < (numberOfPages + 1); page++) {
			console.log("PAGE# ", page);
			promises.push(
				function() {
					classy.organizations.listTransactions(34, {
						token: 'app',
						filter: 'purchased_at>2017-01-01T10:00:00',
						page: page
					})

					// Add each page's 20 transactions to var classyData. higherPagesResponses is just the 20 transactions per page above 2.
					.then(function(higherPagesResponses) {
						for (x = 0; x < higherPagesResponses.data.length; x++) {

							console.log("X: ", x);
							console.log("TRANSACTION_ID: ", higherPagesResponses.data[i].id);
							// formatting in the way fast-csv wants it to put each data point in a new row.. [[h1,h1], [r1,c1], [r2,c2]].
							classyData.push(new Array(higherPagesResponses.data[i].member_id.toString()));
						}
					});
				}
			)
			console.log("PROMISES LENGTH: ", promises.length);
		};

		// And request them all asynchronously
		Promise.all(promises).then((results) => {
			// ~~~~~ MIGHT NEED TO FLATTEN ARRAY HERE!  ~~~~~ see what this looks like
	    // but the results should be an array of all data return from pages 2 through 134.
		})

		.catch((err) => {
			console.log("ERROR 2ND THROUGH LAST PAGE: " + error);
	  });
		
		// LASTLY, PIPE CLASSYDATA INTO CSV
		csv
			.write( classyData, {headers: csvHeaders} )
			.pipe(ws);
	})

	.catch(function(error) {
		console.log("ERROR ON FIRST PAGE: " + error);
	});

});



