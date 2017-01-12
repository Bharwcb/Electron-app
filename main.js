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

app.then(() => {

	// First, loop through all transactions (with sample time filter)
	classy.organizations.listTransactions(34, {
		token: 'app',
		filter: 'purchased_at>2017-01-11T10:00:00'
	})

	.then((response) => {
		// response is an array of JSON transaction data, 20 per page. Add the first page of responses to var classyData.
		var ws = fs.createWriteStream('./result.csv');
		console.log("PAGE 1");

		for (var i = 0; i < response.data.length; i++) {
			console.log("I: ", i);
			console.log("TRANSACTION_ID: ", response.data[i].id);
			// formatting var classyData in the way fast-csv wants it to put each of 20 transactions row by row.. [[h1,h1], [r1,c1], [r2,c2]].
			classyData.push(new Array(response.data[i].member_id.toString()));
		};

		const numberOfPages = response.last_page;
		let promises = [];

		// Request all remaining pages after the first page, add to promises array and call later with Promise.all
		for (var page = 2; page < (numberOfPages + 1); page++) {
			promises.push(

					classy.organizations.listTransactions(34, {
						token: 'app',
						filter: 'purchased_at>2017-01-11T10:00:00',
						page: page
					})
			);
		};

		// Request all promises for pages 2 through last page.
		// RESULTS:  
			// 	[ 
					// { current_page: 2,
		  			// data: [ [Object], [Object], ... ],
			  		// from: 21, 
		  			// to: 40, ... },

					// { current_page: 3,
		  			// data: [ [Object], [Object], ... ],
	  				// from: 41, 
	  				// to: 60, ... },
				// ]
		Promise.all(promises).then((results) => {
			console.log(results);
			for (var x = 2; x <= (results.length + 1); x++) {
				console.log("JSON RESPONSE PROMISE PAGE NUMBER: ", x);
				// console.log("HIGHER TRANSACTION_ID: ", results.data[x].id);
			// 	classyData.push(new Array(response.data[x].member_id.toString()));
			}
		})

		.catch((error) => {
			console.log("ERROR 2ND THROUGH LAST PAGE: " + error);
	  });
		
		// csv
		// 	.write( classyData, {headers: csvHeaders} )
		// 	.pipe(ws);

	})

	.catch(function(error) {
		console.log("ERROR ON FIRST PAGE: " + error);
	});

});



