// manages .env file
require('dotenv').load();

var fs = require('fs');
var csv = require('fast-csv');
var attributes = require('./attributes');
var async = require('async');
var classy = require('./classy-build');
const app = classy.app();
var ws = fs.createWriteStream('./result.csv');
const time_filter = '>2017-01-19T10:00:00';
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

app
.then(() => {
	return require('./title')(indexedTitle, time_filter, title_question_id);
})
.then(() => {
	return require('./middlename')(indexedMiddlename, time_filter, middlename_question_id);
})
.then(() => {
	return require('./company')(indexedCompany, time_filter, company_question_id);
})
.then(() => {
	return require('./suffix')(indexedSuffix, time_filter, suffix_question_id);
})

// Finally, loop through all transactions (sample time filter), matching against custom question hashes, and perform some additional calls like transaction/id to get campaign name
.then(() => {
	return classy.organizations.listTransactions(34, {
		token: 'app',
		filter: 'status=success,purchased_at' + time_filter
	});
})
.then((response) => {
	// response is an array of JSON transaction data, 20 per page. Add the first page of responses to var classyData.
	for (var i = 0; i < response.data.length; i++) {
		var transaction = response.data[i];
		// ~~~ Building classyData for First Page ~~~
		// console.log("Indexed Title: ", indexedTitle);
		// console.log("Indexed Middlename: ", indexedMiddlename);
		// console.log("Indexed Company: ", indexedCompany);
		// console.log("Indexed Suffix: ", indexedSuffix);


		// ~~~ Fire off GET transaction/id to retrieve company name ~~~

		let transaction_id = transaction.id;

		// invoke campaign.js
		require('./campaign')(transaction_id);


		// ~~~ End of GET transaction/id


		attributes.fetchAttributes(transaction, classyData, indexedTitle, indexedMiddlename, indexedCompany, indexedSuffix);
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

	return Promise.all(transactionPromises);
})
.then((results) => {

	results.forEach(function(promisePageNumber) {
		var arrayOfTransactions = promisePageNumber.data;
		arrayOfTransactions.forEach(function(transaction, index) {
			// ~~~ Building classyData for Promises ~~~
			attributes.fetchAttributes(transaction, classyData, indexedTitle, indexedMiddlename, indexedCompany, indexedSuffix);
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








