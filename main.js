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
const csvHeaders = ["Contact ID", "Title", "Last Name", "First Name", "Middle Name", "Company", "Suffix", "Billing Email", "Phone", "Street 1", "Street 2", "City", "State/Providence", "ZIP/Postal Code", "Country", "Member ID", "Campaign Title", "Form Title", "Net Transaction Amount", "Transaction Date", "Gift Type", "Temple Name", "Designee 1 Administrative Name", "Origin of Gift", "Payment Method", "Settlement Status", "Billing Last Name", "Billing First Name", "Billing Middle Name", "Billing Suffix", "Billing Street1", "Billing Street2", "Billing City", "Billing State", "Billing Zip", "Billing Phone", "Is Honor Gift", "Tribute First Name", "Tribute Last Name", "Sender Address 1", "Sender Address 2", "Sender City", "Sender State", "Sender Zip", "Sender Country", "Source Code Type", "Source Code Text", "Sub Source Code Text", "Name of Staff Member", "Donation Comment", "Store Name"];

// used to collect list of contact IDs, title, or whatever you are fetching. then, write to csv.
let classyData = [];

app.then(() => {

	// First, loop through all transactions (with sample time filter)
	classy.organizations.listTransactions(34, {
		token: 'app',
		filter: 'purchased_at>2017-01-12T10:00:00,status=success'
	})

	.then((response) => {

		// response is an array of JSON transaction data, 20 per page. Add the first page of responses to var classyData.
		var ws = fs.createWriteStream('./result.csv');
	
		for (var i = 0; i < response.data.length; i++) {
			// format var classyData in the way fast-csv wants it to put each of 20 transactions row by row.. [[contact ID1, title1], [contact ID2, title2]].. etc.
			var transaction = response.data[i];

			// ~~~ Building classyData for First Page
			let last_name = transaction.billing_last_name;
			if (last_name == null) {
				last_name = "last_name";
			};

			let first_name = transaction.billing_first_name;
			if (first_name == null) {
				first_name = "first_name";
			}
			
			// !!! template for adding an attribute: classyData.push(new Array(transaction.member_id.toString()));
			classyData.push(new Array("contact ID", "title", last_name, first_name));
		};

		const numberOfPages = response.last_page;
		let promises = [];

		// Request all remaining pages after the first page, add to promises array to call asynchronously with Promise.all
		for (var page = 2; page < (numberOfPages + 1); page++) {
			promises.push(
					classy.organizations.listTransactions(34, {
						token: 'app',
						filter: 'purchased_at>2017-01-12T10:00:00,status=success',
						page: page
					})
			);
		};

		Promise.all(promises).then((results) => {
			results.forEach(function(promisePageNumber) {

				var arrayOfTransactions = promisePageNumber.data;
				arrayOfTransactions.forEach(function(item, index) {
					// ~~~ Building classyData for Promises ~~~

					let last_name = item.billing_last_name;
					if (last_name == null) {
						last_name = "last_name";
					};

					let first_name = transaction.billing_first_name;
					if (first_name == null) {
						first_name = "first_name";
					}
			
					/* 
					!!! template for adding an attribute: 
					var member_id = arrayOfTransactions[index].member_id;
					classyData.push(new Array(member_id.toString()));
					*/
					classyData.push(new Array("contact ID", "title", last_name, first_name));
				});
				// TEST - print all transaction ID's here since member ID mostly the same. (make a new collection above, and push whereever push to classyData)
			});
			// TEST - test total amount of transactions.. console.log("CLASSY DATA LENGTH", classyData.length);
		
		csv
			.write( classyData, {headers: csvHeaders} )
			.pipe(ws);
		})
		.catch((error) => {
			console.log("ERROR 2ND THROUGH LAST PAGE: " + error);
	  });
	})
	.catch((error) => {
		console.log("ERROR ON FIRST PAGE: " + error);
	});
});



