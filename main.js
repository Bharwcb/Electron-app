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
let testingTransactionIds = [];

app.then(() => {

	// First, loop through all transactions (with sample time filter)
	classy.organizations.listTransactions(34, {
		token: 'app',
		filter: 'purchased_at>2017-01-11T10:00:00'
	})

	.then((response) => {

		// response is an array of JSON transaction data, 20 per page. Add the first page of responses to var classyData.
		var ws = fs.createWriteStream('./result.csv');
	
		for (var i = 0; i < response.data.length; i++) {
			// formatting var classyData in the way fast-csv wants it to put each of 20 transactions row by row.. [[r1,c1], [r2,c2]].. etc.
			classyData.push(new Array(response.data[i].member_id.toString()));
			testingTransactionIds.push(new Array(response.data[i].id.toString()));
		};

		const numberOfPages = response.last_page;
		let promises = [];

		// Request all remaining pages after the first page, add to promises array to call asynchronously with Promise.all
		for (var page = 2; page < (numberOfPages + 1); page++) {
			promises.push(
					classy.organizations.listTransactions(34, {
						token: 'app',
						filter: 'purchased_at>2017-01-11T10:00:00',
						page: page
					})
			);
		};

		Promise.all(promises).then((results) => {
			// Callback 'results' looks like this (an array of pages):  
			// [ 
				// { current_page: 2,
	  			// data: [ [Object], [Object], ... to per_page amount ],
		  		// from: 21, 
	  			// to: 40, ... }, // eachPageResponse = 2!!

				// { current_page: 3,
	  			// data: [ [Object], [Object], ... to per_page amount ],
					// from: 41, 
					// to: 60, ... }, // eachPageResponse = 3!!
			// ]

			for (var promisePageNumber = 2; promisePageNumber <= (results.length + 1); promisePageNumber++) {

				// eachPageResponse is what a full page response looks like.. includes data (an array of transactions objects) and current_page, next_page, etc.  Start it at index 0, the first page of RESULTS (which is pages 2 through last)
				var eachPageResponse = results[(promisePageNumber - 2)];
				var arrayOfTransactions = eachPageResponse.data;

				for (var transactionIndex = 0; transactionIndex < arrayOfTransactions.length; transactionIndex++) {
					// TEST: use this test to make sure this grabs every single transaction id on all pages: console.log("TESTING ID: ", arrayOfTransactions[transactionIndex].id);
					var member_id = arrayOfTransactions[transactionIndex].member_id;
					classyData.push(new Array(member_id.toString()));
					testingTransactionIds.push(new Array(arrayOfTransactions[transactionIndex].id.toString()));
				}
				// console.log("ALL TRANSACTION IDS!!!", testingTransactionIds);
				// console.log("number of transaction id's on this page", testingTransactionIds.length);
			}
		console.log("CLASSY DATA LENGTH", classyData.length);

		csv
			.write( classyData, {headers: csvHeaders} )
			.pipe(ws);
			
		})

		.catch((error) => {
			console.log("ERROR 2ND THROUGH LAST PAGE: " + error);
	  });
		
	})

	.catch(function(error) {
		console.log("ERROR ON FIRST PAGE: " + error);
	});

});



