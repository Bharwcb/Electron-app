// manages .env file
require('dotenv').load();

var fs = require('fs');
var csv = require('fast-csv');
var attributes = require('./attributes');
var async = require('async');
var classy = require('./classy-build');
const app = classy.app();

const time_filter = '>2017-01-18T10:00:00';

// one place to change headers for import
const csvHeaders = ["Contact ID", "Title", "Last Name", "First Name", "Middle Name", "Company", "Suffix", "Billing Email", "Phone", "Street 1", "Street 2", "City", "State/Providence", "ZIP/Postal Code", "Country", "Member ID", "Campaign Title", "Form Title", "Net Transaction Amount", "Transaction Date", "Gift Type", "Temple Name", "Designee 1 Administrative Name", "Origin of Gift", "Payment Method", "Settlement Status", "Billing Last Name", "Billing First Name", "Billing Middle Name", "Billing Suffix", "Billing Street1", "Billing Street2", "Billing City", "Billing State", "Billing Zip", "Billing Phone", "Is Honor Gift", "Tribute First Name", "Tribute Last Name", "Sender Title", "Sender First Name", "Sender Last Name", "Sender Address 1", "Sender Address 2", "Sender City", "Sender State", "Sender Zip", "Sender Country", "Source Code Type", "Source Code Text", "Sub Source Code Text", "Name of Staff Member", "Donation Comment", "Store Name"];

// used to collect list of contact IDs, title, or whatever you are fetching. then, write to csv.
let classyData = [];
// used for custom answers, to avoid querying API more than have to.
let indexedTitle = {};

app.then(() => {

	async.series([

		function(next){
			// build the indexed custom title hash to apply in next function when retreive entire list of transactions
			require('./title')(next, indexedTitle, time_filter);
		},

		function(next){
			console.log("indexed title: ", indexedTitle);
			
			// First, loop through all transactions (with sample time filter)
			classy.organizations.listTransactions(34, {
				token: 'app',
				filter: 'status=success,purchased_at' + time_filter
			})

			.then((response) => {
				// response is an array of JSON transaction data, 20 per page. Add the first page of responses to var classyData.
				var ws = fs.createWriteStream('./result.csv');

				for (var i = 0; i < response.data.length; i++) {
					var transaction = response.data[i];
					// ~~~ Building classyData for First Page ~~~
					console.log("Indexed Title: ", indexedTitle);
					attributes.fetchAttributes(transaction, classyData, indexedTitle);
				};

				const numberOfPages = response.last_page;
				let transactionPromises = [];
				// Request all remaining pages after the first page, add to promises array to call asynchronously with Promise.all
				for (var page = 2; page < (numberOfPages + 1); page++) {
					transactionPromises.push(
							classy.organizations.listTransactions(34, {
								token: 'app',
								filter: 'status=success,purchased_at' + time_filter,
								page: page
							})
					);
				};

				Promise.all(transactionPromises).then((results) => {

					results.forEach(function(promisePageNumber) {
						var arrayOfTransactions = promisePageNumber.data;
						arrayOfTransactions.forEach(function(transaction, index) {
							// ~~~ Building classyData for Promises ~~~
							attributes.fetchAttributes(transaction, classyData, indexedTitle);
						});
						// TEST - print all transaction ID's here since member ID mostly the same. (make a new collection above, and push whereever push to classyData)
					});
					// TEST - test total amount of transactions.. console.log("CLASSY DATA LENGTH", classyData.length);

				csv
					.write( classyData, {headers: csvHeaders} )
					.pipe(ws);
					console.log("CSV Complete.");
				})
				.catch((error) => {
					console.log("ERROR 2ND THROUGH LAST PAGE: " + error);
			  });
			})
			.catch((error) => {
				console.log("ERROR ON FIRST PAGE: " + error);
			});
		}
		// end of asynch 2 (transactions)

	]);

})








