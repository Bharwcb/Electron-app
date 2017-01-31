require('dotenv').load();
var fs = require('fs');
var csv = require('fast-csv');
var constituent_attributes = require('./constituent-attributes');
var revenue_attributes = require('./revenue-attributes');
var async = require('async');
var classy = require('./classy-build');
const app = classy.app();
var prompt = require('prompt');
// rimraf used to clear downloads contents
var rmdir = require('rimraf');

const title_question_id = 46362;
const middlename_question_id = 46183;
const company_question_id = 46182;
const suffix_question_id = 46519;
const temple_name_question_id = 46758;
const designee_question_id = 46763;

// one place to change headers for import
const csvConstituentHeaders = ["Contact ID", "Title", "Last Name", "First Name", "Middle Name", "Company", "Suffix", "Billing Email", "Phone", "Street 1", "Street 2", "City", "State/Providence", "ZIP/Postal Code", "Country", "Member ID", "Campaign Title", "Form Title", "Net Transaction Amount", "Transaction Date", "Gift Type", "Temple Name", "Designee 1 Administrative Name", "Origin of Gift", "Payment Method", "Settlement Status", "Billing Last Name", "Billing First Name", "Billing Middle Name", "Billing Suffix", "Billing Street1", "Billing Street2", "Billing City", "Billing State", "Billing Zip", "Billing Phone", "Is Honor Gift", "Tribute First Name", "Tribute Last Name", "Sender Title", "Sender First Name", "Sender Last Name", "Sender Address 1", "Sender Address 2", "Sender City", "Sender State", "Sender Zip", "Sender Country", "Source Code Type", "Source Code Text", "Sub Source Code Text", "Name of Staff Member", "Donation Comment", "Store Name"];

const csvRevenueHeaders = ["Account System", "Constituent", "Lookup ID", "Last/org/group/household name", "First Name", "Middle Name", "Title", "Suffix", "Address", "City", "State", "Zip", "Country", "Phone Number", "Email Address", "Amount", "Date", "Revenue Type", "Payment Method", "Inbound Channel", "Application", "Appeal", "Designation", "GL Post Status", "Card Type", "Gift Type", "Tribute Last Name", "Tribute", "Temple Name", "Organization", "Temple recognition credit type"];

// constituentData and revenueData used to collect data for CSV creation.
let constituentData = [];
let revenueData = [];
// the following indexed hashes are used for custom answers.. to avoid querying API for every transaction.
let indexedTitle = {};
let indexedMiddlename = {};
let indexedCompany = {};
let indexedSuffix = {};
let indexedTempleName = {};
let indexedDesignee = {};
let campaignIdKeyNameValue = {};

prompt.start();
console.log("Please enter Date/Time in the following format: YYYY-MM-DDTHH:MM:SS+0000 ");
prompt.get(['start_date', 'end_date'], (err, result) => {
	console.log("Input Received.");
	let start_date = result.start_date;
	let end_date = result.end_date;
	runReport(start_date, end_date);
});

// clearFolder removes contents of downloads since CSV filenames will be different with each report pulled (different timestamps)
clearFolder('./downloads');

// csv_date formats csv filenames to current datetime
let csv_date = new Date();
csv_date = 
	csv_date.getFullYear() + 
	('0' + (csv_date.getMonth() + 1)).slice(-2) + 
	('0' + csv_date.getDate()).slice(-2) + '-' + 
	('0' + csv_date.getHours()).slice(-2) + ':' +
	('0' + csv_date.getMinutes()).slice(-2);

var constituent = fs.createWriteStream('./downloads/Shriners-' + csv_date + '(constituent).csv');
var revenue = fs.createWriteStream('./downloads/Shriners-' + csv_date + '(revenue).csv');

// const start_date = '2017-01-26T10:00:00';
// const end_date = '2017-01-28T10:00:00';

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
		return require('./templename')(indexedTempleName, start_date, end_date, temple_name_question_id);
	})
	.then(() => {
		return require('./designee')(indexedDesignee, start_date, end_date, designee_question_id);
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
		// response is an array of JSON transaction data, 20 per page. Add the first page of responses to var constituentData.
		for (var i = 0; i < response.data.length; i++) {
			var transaction = response.data[i];
			// ~~~ Building constituentData for First Page ~~~
			// console.log("campaignIdKeyNameValue: ", campaignIdKeyNameValue);

			constituent_attributes.fetchAttributes(transaction, constituentData, indexedTitle, indexedMiddlename, indexedCompany, indexedSuffix, indexedTempleName, indexedDesignee, campaignIdKeyNameValue);

			revenue_attributes.fetchAttributes(transaction, revenueData, indexedCompany, indexedMiddlename, indexedTitle, indexedSuffix, campaignIdKeyNameValue, indexedDesignee, indexedTempleName);
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

				// ~~~ Building constituentData for Promises ~~~
				constituent_attributes.fetchAttributes(transaction, constituentData, indexedTitle, indexedMiddlename, indexedCompany, indexedSuffix, indexedTempleName, indexedDesignee, campaignIdKeyNameValue);

				revenue_attributes.fetchAttributes(transaction, revenueData, indexedCompany, indexedMiddlename, indexedTitle, indexedSuffix, campaignIdKeyNameValue, indexedDesignee, indexedTempleName);
			});
			// TEST - print all transaction ID's here since member ID mostly the same. (make a new collection above, and push whereever push to constituentData)
		});
		
		// Set up CSV promises to ensure process.exit() only happens after all CSV's are complete.
		let csvPromises = [];
		
		var constituentPromise = new Promise((resolve, reject) => {
			csv
				.write( constituentData, {headers: csvConstituentHeaders} )
				.pipe(constituent)
				.on("finish", () => {
					console.log("Constituent CSV complete");
					resolve();
				})
		});

		var revenuePromise = new Promise((resolve, reject) => {
			csv
				.write( revenueData, {headers: csvRevenueHeaders} )	
				.pipe(revenue)
				.on("finish", () => {
					console.log("Revenue CSV complete");
					resolve();
				})	
		});
		
		csvPromises.push(constituentPromise, revenuePromise);

		return Promise.all(csvPromises)
		.then(() => {
			console.log("All CSV's are complete");
			process.exit();
	  });

	})
	.catch((error) => {
		console.log("Error somewhere in the chain: " + error);
	});
})

function clearFolder(folder) {
	files = fs.readdirSync('./downloads');
	files.forEach(function(file, index) {
		console.log("File index ...", index);
		rmdir('./downloads/' + file, ((err) =>{}));
	});
}



