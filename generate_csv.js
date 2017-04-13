/*
API REQUESTS AND CSV FILE GENERATION
*/

// in case multiple reports are pulled with equal titles
csvCopies = 0;

const fs = require('fs');
const opn = require('opn');

let constituentCSV;
let revenueCSV;

// need full CSV paths used for opening .csv with 'opn'
let constituentCSVPath;
let revenueCSVPath;

let dialog = document.getElementById('newReportModal');

// remote used to minimize window which shuts down electron when user clicks 'exit' in modal
const electron = require('electron');
const remote = electron.remote;

const path = require('path');
const url = require('url');
const csv = require('fast-csv');
const constituent_attributes = require('./constituent-attributes');
const revenue_attributes = require('./revenue-attributes');
const async = require('async');
const classy = require('./classy-build');
// testing env variables:
// console.log("classy: ", classy);
const app = classy.app();
const prompt = require('prompt');
// rimraf used to clear downloads contents
const rmdir = require('rimraf');
const moment = require('moment');

const title_question_id = 46362;
const middlename_question_id = 46183;
const company_question_id = 46182;
const suffix_question_id = 46519;
const temple_name_question_id = 46758;
const designee_question_id = 46763;

// one place to change headers for import
const csvConstituentHeaders = ["Contact ID", "Title", "Last Name", "First Name", "Middle Name", "Company", "Suffix", "Billing Email", "Phone", "Street 1", "Street 2", "City", "State/Providence", "ZIP/Postal Code", "Country", "Member ID", "Campaign Title", "Form Title", "Net Transaction Amount", "Transaction Date", "Gift Type", "Temple Name", "Designee 1 Administrative Name", "Origin of Gift", "Payment Method", "Settlement Status", "Billing Last Name", "Billing First Name", "Billing Middle Name", "Billing Suffix", "Billing Street1", "Billing Street2", "Billing City", "Billing State", "Billing Zip", "Billing Phone", "Is Honor Gift", "Tribute First Name", "Tribute Last Name", "Sender Title", "Sender First Name", "Sender Last Name", "Sender Address 1", "Sender Address 2", "Sender City", "Sender State", "Sender Zip", "Sender Country", "Source Code Type", "Source Code Text", "Sub Source Code Text", "Name of Staff Member", "Donation Comment", "Store Name"];
const csvRevenueHeaders = ["Account System", "Constituent", "Lookup ID", "Last/org/group/household name", "First Name", "Middle Name", "Title", "Suffix", "Address", "City", "State", "Zip", "Country", "Phone Number", "Email Address", "Amount", "Date", "Revenue Type", "Payment Method", "Inbound Channel", "Application", "Appeal", "Designation", "GL Post Status", "Card Type", "Gift Type", "Tribute Last Name", "Tribute", "Temple Name", "Organization", "Temple recognition credit type"];

// the following indexed hashes are used for custom answers.. to avoid querying API for every transaction.
let indexedTitle = {};
let indexedMiddlename = {};
let indexedCompany = {};
let indexedSuffix = {};
let indexedTempleName = {};
let indexedDesignee = {};
let campaignIdKeyNameValue = {};

function generateCSV(start_date, end_date) {

	startGeneratingReportSpinner();

	// constituentData and revenueData used to collect data for CSV creation.
	let constituentData = [];
	let revenueData = [];

	runReport(start_date, end_date);

	// ~~~ CALENDAR ~~~  Get start_date & end_date from calendar.js. generateCSV() runs when button is clicked
	// ~~~ Testing - NOTE: with release 2/28/17 need to feed ISO string to moment(date).format() ~~~
	// const start_date = '2017-01-26T10:00:00';
	// const end_date = '2017-01-28T10:00:00';

	// create downloads folder

	mkdirSync( path.join(__dirname, 'downloads') );

	// remove contents of downloads since CSV filenames will be different with each report pulled (different timestamps)
	clearFolder('downloads');

	// NAMING CSV FILES (csv_date grabs time report pulled)
	let csv_date = new Date();
	csv_date = 
		('0' + csv_date.getHours()).slice(-2) + '.' +
		('0' + csv_date.getMinutes()).slice(-2);

	buildCSVPaths();

	// if file already exists (i.e. if a report was generated in the same minute), add (1), (2).. etc.
	if (CSVTitleAlreadyExists(constituentCSVPath) || (CSVTitleAlreadyExists(revenueCSVPath))) {
		// add (1), (2), etc..
		csvCopies += 1;
		csv_date = csv_date + "(" + csvCopies + ")";
		buildCSVPaths();
	}

	function buildCSVPaths() {
		constituentCSVPath = path.join(__dirname, 'downloads', 'Shriners-' + csv_date + '(constituent).csv')
		revenueCSVPath = path.join(__dirname, 'downloads', 'Shriners-' + csv_date + '(revenue).csv')
	}

	function CSVTitleAlreadyExists(file) {
		try {
			fs.accessSync(file);
			return true;
		} catch (e) {
			return false;
		}
	}

	// CSV
	constituentCSV = fs.createWriteStream(constituentCSVPath);
	revenueCSV = fs.createWriteStream(revenueCSVPath);

	// declare variables to display CSV titles in sidebar UI, lot of Electron path stuff we don't want to display.. then export to use in Angular controller (main-controller.js)
	let constituentCSVDisplaySidebar = constituentCSVPath.split("downloads/")[1];
	let revenueCSVDisplaySidebar = revenueCSVPath.split("downloads/")[1];
	exports.revenueCSVDisplaySidebar = revenueCSVDisplaySidebar;
	exports.constituentCSVDisplaySidebar = constituentCSVDisplaySidebar;

	function runReport(start_date, end_date) {
		console.log("~~~ Running report ~~~");
		app
		.then(() => {
			return require('./custom-questions/title')(indexedTitle, start_date, end_date, title_question_id);
		})
		.then(() => {
			return require('./custom-questions/middlename')(indexedMiddlename, start_date, end_date, middlename_question_id);
		})
		.then(() => {
			return require('./custom-questions/company')(indexedCompany, start_date, end_date, company_question_id);
		})
		.then(() => {
			return require('./custom-questions/suffix')(indexedSuffix, start_date, end_date, suffix_question_id);
		})
		.then(() => {
			return require('./custom-questions/templename')(indexedTempleName, start_date, end_date, temple_name_question_id);
		})
		.then(() => {
			return require('./custom-questions/designee')(indexedDesignee, start_date, end_date, designee_question_id);
		})
		.then(() => {
			return require('./custom-questions/campaign')(campaignIdKeyNameValue);
		})

		// Finally, loop through all transactions (sample time filter), matching against custom question hashes, campaign reference hash, etc...
		.then(() => {
			return classy.organizations.listTransactions(34, {
				token: 'app',
				with: 'dedication',
				requestDebug: false,
				filter: 'status!=incomplete,status!=canceled,status!=cb_initiated,status!=cb_lost,status!=test,status!=1,purchased_at>' + start_date + ',purchased_at<' + end_date
				// filter ONLY success and refunded transactions
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
						requestDebug: false,
						filter: 'status!=incomplete,status!=canceled,status!=cb_initiated,status!=cb_lost,status!=test,status!=1,purchased_at>' + start_date + ',purchased_at<' + end_date,
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

					// ~~~ Building constituentData & revenueData for Promises ~~~
					constituent_attributes.fetchAttributes(transaction, constituentData, indexedTitle, indexedMiddlename, indexedCompany, indexedSuffix, indexedTempleName, indexedDesignee, campaignIdKeyNameValue);

					revenue_attributes.fetchAttributes(transaction, revenueData, indexedCompany, indexedMiddlename, indexedTitle, indexedSuffix, campaignIdKeyNameValue, indexedDesignee, indexedTempleName);
					// ~~~

				});
				// TEST - print all transaction ID's here since member ID mostly the same. (make a new collection above, and push whereever push to constituentData)
			});
			
			// Set up CSV promises to ensure process.exit() only happens after all CSV's are complete.
			let csvPromises = [];
			
			var constituentPromise = new Promise((resolve, reject) => {
				csv
					.write( constituentData, {headers: csvConstituentHeaders} )
					.pipe(constituentCSV)
					.on("finish", () => {
						console.log("Constituent CSV complete");

						resolve();
					})
			});

			var revenuePromise = new Promise((resolve, reject) => {
				csv
					.write( revenueData, {headers: csvRevenueHeaders} )	
					.pipe(revenueCSV)
					.on("finish", () => {
						console.log("Revenue CSV complete");
						resolve();
					})	
			});
			
			csvPromises.push(constituentPromise, revenuePromise);

			return Promise.all(csvPromises)
			.then(() => {
				console.log("All CSV's are complete");
				openCSV();
				openModal();
				// process.exit();
		  });

		})
		.catch((error) => {
			console.log("Error somewhere in the chain: ", error);
		});
	}

	function startGeneratingReportSpinner() {
		var scope = angular
			.element(document.getElementById('spinner'))
			.scope();
		scope.startSpin();
		scope.$apply();
	};
	
	// ~~~ management of downloads folder ~~~
	function clearFolder(folder) {
		var files = fs.readdirSync( path.join(__dirname, folder) );

		files.forEach(function(file, index) {
			rmdir(path.join(__dirname, 'downloads', file), ((err) =>{}));
		});
	}

	function mkdirSync(path) {
		try {
			fs.mkdirSync(path);
		} catch(e) {
			if ( e.code != 'EEXIST' ) throw e;
		}
	}
	// ~~~
};

function openModal() {
	stopGeneratingReportSpinner();
	dialog.showModal();
};

function stopGeneratingReportSpinner() {
	var scope = angular
		.element(document.getElementById('spinner'))
		.scope();
	scope.stopSpin();
	scope.$apply();
};

// click 'exit' after CSV created - shuts down electron
function exitModal() {
	console.log("Exit clicked");
	dialog.close();
	// remote shuts down electron
	var window = remote.getCurrentWindow();
  window.close();
}

// ~~~ click 'generate new report' after CSVs created
const calendar = require('./calendar.js');
const angularApp = require('./main-controller.js');
function newReport() {
	dialog.close();
	// clear dates (a flatpickr method)
	calendar.clearCalendars();
}
// ~~~

function openCSV() {
	opn(constituentCSVPath);
	opn(revenueCSVPath);
};

module.exports = {
	generateCSV: function(start_date, end_date) {
		return generateCSV(start_date, end_date);
	},
	// only exporting openCSV in case want to open old downloaded files in UI
	openCSV: function() {
		return openCSV();
	},
	// when click 'exit' or 'yes' in modal after CSV created
	exitModal: function() {
		return exitModal();
	},
	newReport: function() {
		return newReport();
	}
}