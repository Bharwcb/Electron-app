// manages .env file
require('dotenv').load();

var Classy = require('classy-node');
var fs = require('fs');
var csv = require('fast-csv');
var attributes = require('./attributes');
var async=require('async');

var classy = new Classy({
	baseUrl: 'https://stagingapi.stayclassy.org',
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
	requestDebug: false
});

const app = classy.app();

// one place to change headers for import
const csvHeaders = ["Contact ID", "Title", "Last Name", "First Name", "Middle Name", "Company", "Suffix", "Billing Email", "Phone", "Street 1", "Street 2", "City", "State/Providence", "ZIP/Postal Code", "Country", "Member ID", "Campaign Title", "Form Title", "Net Transaction Amount", "Transaction Date", "Gift Type", "Temple Name", "Designee 1 Administrative Name", "Origin of Gift", "Payment Method", "Settlement Status", "Billing Last Name", "Billing First Name", "Billing Middle Name", "Billing Suffix", "Billing Street1", "Billing Street2", "Billing City", "Billing State", "Billing Zip", "Billing Phone", "Is Honor Gift", "Tribute First Name", "Tribute Last Name", "Sender Title", "Sender First Name", "Sender Last Name", "Sender Address 1", "Sender Address 2", "Sender City", "Sender State", "Sender Zip", "Sender Country", "Source Code Type", "Source Code Text", "Sub Source Code Text", "Name of Staff Member", "Donation Comment", "Store Name"];

// used to collect list of contact IDs, title, or whatever you are fetching. then, write to csv.
let classyData = [];
// used for custom answers, to avoid querying API more than have to.
let indexedTitle = {};

async.series([

	function(next){
		// ~~ Start of Additional Requests ~~ 
		app.then(() => {
			classy.questions.listAnswers(46362, {
				token: 'app',
				per_page: '1'
			}).then((answersResults) => {
				console.log("page 1 answer results: ", answersResults);
				let answers = answersResults.data;
				answers.forEach(answer => {
					indexedTitle[answer.answerable_id] = answer.answer;
				});

				// all additional pages of title
				
				const numberOfTitlePages = answersResults.last_page;
				let titlePromises = [];

				for (var page = 2; page < (numberOfTitlePages + 1); page++) {
					titlePromises.push(
						classy.questions.listAnswers(46362, {
							token: 'app',
							per_page: '1',
							page: page
						})
					);
				};
				
				Promise.all(titlePromises).then((titleResults) => {
					console.log("Title results pages 2 through end: ", titleResults);
					titleResults.forEach(function(arrayofTitlesPerPage) {

						var arrayofTitles = arrayofTitlesPerPage.data;
						arrayofTitles.forEach(function(answer, index) {
							indexedTitle[answer.answerable_id] = answer.answer;
						});
						// so, it's building indexed title correctly.
					});
					next();
				}).catch((error) => {
					console.log("ERROR IN ANSWERS OTHER PAGES", error);
				})

			}).catch((error) => {
				console.log("ERROR IN ANSWERS FIRST PAGE: ", error);
			});
		});
		// ~~ End of async step 1 (title).  SHOULD collect the whole indexedTitle by now.
	},

	function(next){

		app.then(() => {
			// First, loop through all transactions (with sample time filter)
			classy.organizations.listTransactions(34, {
				token: 'app',
				filter: 'purchased_at>2017-01-17T10:00:00,status=success'
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
								filter: 'purchased_at>2017-01-17T10:00:00,status=success',
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
		});
	}
	// end of asynch 2 (transactions)

]);






