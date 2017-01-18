// manages .env file
require('dotenv').load();

var Classy = require('classy-node');
var fs = require('fs');
var csv = require('fast-csv');
var attributes = require('./attributes');

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
			// format var classyData in the way fast-csv wants it to put each of 20 transactions row by row.. [[contact ID1, title1], [contact ID2, title2]].. etc.
			var transaction = response.data[i];

			// ~~ Start of Additional Requests ~~ 
				// let transaction_id = transaction.id; 
				// try transactions.listAnswers too
				// classy.transactions.retrieve(transaction_id, {
				// 	token: 'app',
				// 	with: 'answers'
				// }).then((transactionResponse) => {
					/* answers is an array of objects
						answers = [
							{
						    "question_id": 46362,
						    "answer": "Miss", ...
						  },
						  {
								"question_id": 12345,
						    "answer": "asgdasg", ...
					    }
					  ]
					*/
				// });
			// ~~ End of Additional Requests

			// ~~~ Building classyData for First Page ~~~
			attributes.fetchAttributes(transaction, classyData);
		};

		const numberOfPages = response.last_page;
		let promises = [];
		// Request all remaining pages after the first page, add to promises array to call asynchronously with Promise.all
		for (var page = 2; page < (numberOfPages + 1); page++) {
			promises.push(
					classy.organizations.listTransactions(34, {
						token: 'app',
						filter: 'purchased_at>2017-01-17T10:00:00,status=success',
						page: page
					})
			);
		};

		Promise.all(promises).then((results) => {
			results.forEach(function(promisePageNumber) {
				var arrayOfTransactions = promisePageNumber.data;
				arrayOfTransactions.forEach(function(transaction, index) {

					// ~~ Start of Additional Requests ~~ 
						// let transaction_id = transaction.id;
						// classy.transactions.retrieve(transaction_id, {
						// 	token: 'app',
						// 	with: 'answers'
						// }).then((transactionResults) => {
							// let title_question_id = "46362";
							// let customAnswers = transactionResults.answers;
							// // goes through every transaction, and checks if there are custom answers
							// if (transactionResults.answers.length > 0) {
							// 	// if there are, iterate through each answer object
							// 	customAnswers.forEach(function(answer, index) {
							// 		// and check if it has the title question_id
							// 		if (answer["question_id"] == title_question_id) {
							// 			// console.log("BEEP BEEP BEEP!  TITLE QUESTION DETECTED");
							// 			// if found, it means this is the custom answer object for title. return the value of 'answer' key.
							// 			console.log(answer["answer"]);
							// 		};
							// 	});
							// };
						// });
					// ~~ End of Additional Requests
					
					// ~~~ Building classyData for Promises ~~~
					attributes.fetchAttributes(transaction, classyData);
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






