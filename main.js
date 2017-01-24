// manages .env file
require('dotenv').load();

var fs = require('fs');
var csv = require('fast-csv');
var attributes = require('./attributes');
var async = require('async');
var classy = require('./classy-build');
const app = classy.app();
var ws = fs.createWriteStream('./result.csv');
var prompt = require('prompt');

const title_question_id = 46362;
const middlename_question_id = 46183;
const company_question_id = 46182;
const suffix_question_id = 46519;

// one place to change headers for import
const csvHeaders = ["Contact ID", "Title", "Last Name", "First Name", "Middle Name", "Company", "Suffix", "Billing Email", "Phone", "Street 1", "Street 2", "City", "State/Providence", "ZIP/Postal Code", "Country", "Member ID", "Campaign Title", "Form Title", "Net Transaction Amount", "Transaction Date", "Gift Type", "Temple Name", "Designee 1 Administrative Name", "Origin of Gift", "Payment Method", "Settlement Status", "Billing Last Name", "Billing First Name", "Billing Middle Name", "Billing Suffix", "Billing Street1", "Billing Street2", "Billing City", "Billing State", "Billing Zip", "Billing Phone", "Is Honor Gift", "Tribute First Name", "Tribute Last Name", "Sender Title", "Sender First Name", "Sender Last Name", "Sender Address 1", "Sender Address 2", "Sender City", "Sender State", "Sender Zip", "Sender Country", "Source Code Type", "Source Code Text", "Sub Source Code Text", "Name of Staff Member", "Donation Comment", "Store Name"];

// used to collect list of contact IDs, title, or whatever you are fetching. then, write to csv.
let classyData = [];
// the following indexed hashes are used for custom answers.. to avoid querying API for every transaction.
let indexedTitle = {};
let indexedMiddlename = {};
let indexedCompany = {};
let indexedSuffix = {};
let campaignIdKeyNameValue = {};

// const start_date = '2017-01-21T10:00:00';
// const end_date = '2017-01-22T10:00:00';

prompt.start();
console.log("Please enter Date/Time in the following format: YYYY-MM-DDTHH:MM:SS+0000 ");
prompt.get(['start_date', 'end_date'], (err, result) => {
	console.log("Input Received.");
	let start_date = result.start_date;
	let end_date = result.end_date;
	runReport(start_date, end_date);
});

var runReport = ((start_date, end_date) => {
	console.log("Running report...");
	app
	.then(() => {
		return require('./title')(indexedTitle, start_date, end_date, title_question_id);
	})
	.then(() => {
		return require('./middlename')(indexedMiddlename, start_date, end_date, middlename_question_id);
	})
	.then(() => {
		return require('./company')(indexedCompany, start_date, end_date, company_question_id);
	})
	.then(() => {
		return require('./suffix')(indexedSuffix, start_date, end_date, suffix_question_id);
	})
	.then(() => {
		return require('./campaign')(campaignIdKeyNameValue);
	})

	// Finally, loop through all transactions (sample time filter), matching against custom question hashes, campaign reference hash, etc...
	.then(() => {
		return classy.organizations.listTransactions(34, {
			token: 'app',
			with: 'dedication',
			filter: 'status=success,purchased_at>' + start_date + ',purchased_at<' + end_date
		});
	})
	.then((response) => {
		// response is an array of JSON transaction data, 20 per page. Add the first page of responses to var classyData.
		for (var i = 0; i < response.data.length; i++) {
			var transaction = response.data[i];
			// ~~~ Building classyData for First Page ~~~
			// console.log("campaignIdKeyNameValue: ", campaignIdKeyNameValue);

			attributes.fetchAttributes(transaction, classyData, indexedTitle, indexedMiddlename, indexedCompany, indexedSuffix, campaignIdKeyNameValue);
		};

		const numberOfPages = response.last_page;
		let transactionListPromises = [];
		// Request all remaining pages after the first page, add to promises array to call asynchronously with Promise.all
		for (var page = 2; page < (numberOfPages + 1); page++) {
			transactionListPromises.push(
					classy.organizations.listTransactions(34, {
						token: 'app',
						with: 'dedication',
						filter: 'status=success,purchased_at>' + start_date + ',purchased_at<' + end_date,
						page: page
					})
			);
		};

		return Promise.all(transactionListPromises);
	})
	.then((results) => {

		results.forEach(function(promisePageNumber) {
			var arrayOfTransactions = promisePageNumber.data;
			arrayOfTransactions.forEach(function(transaction, index) {

				// ~~~ Building classyData for Promises ~~~
				attributes.fetchAttributes(transaction, classyData, indexedTitle, indexedMiddlename, indexedCompany, indexedSuffix, campaignIdKeyNameValue);
			});
			// TEST - print all transaction ID's here since member ID mostly the same. (make a new collection above, and push whereever push to classyData)
		});
		// TEST - test total amount of transactions.. console.log("CLASSY DATA LENGTH", classyData.length);

		csv
			.write( classyData, {headers: csvHeaders} )
			.pipe(ws)
			.on("finish", () => {
				console.log("CSV complete");
			})

	})
	.catch((error) => {
		console.log("Error somewhere in the chain: " + error);
	});
})





