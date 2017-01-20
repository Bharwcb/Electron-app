// GET transaction/id to fetch campaign.name

classy = require('./classy-build');

var fetchCompanyName = function(transaction_id) {

	return classy.transactions.retrieve(transaction_id, {
		token: 'app'
	})

	// and the end, send this BACK to main.js, to then inject into custom q

	.then((transactionResults) => {
		let campaignName = transactionResults.campaign.name;
		console.log("campaign name: campaignName");
		// let answers = answersResults.data;
		// answers.forEach(answer => {
		// 	indexedCompany[answer.answerable_id] = answer.answer;
		// });

		// // all additional pages of title
		// const numberOfCompanyPages = answersResults.last_page;
		// let companyPromises = [];

		// for (var page = 2; page < (numberOfCompanyPages + 1); page++) {
		// 	companyPromises.push(
		// 		classy.questions.listAnswers(company_question_id, {
		// 			token: 'app',
		// 			page: page,
		// 			filter: 'created_at' + time_filter
		// 		})
		// 	);
		// };
		
		// return Promise.all(companyPromises);
	})



};

module.exports = fetchCompanyName;