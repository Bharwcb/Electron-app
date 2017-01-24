classy = require('./classy-build');

// ~~ Start of Additional Requests ~~ 
var buildCustomCompanyHash = function(indexedCompany, start_date, end_date, company_question_id) {

	return classy.questions.listAnswers(company_question_id, {
		token: 'app',
		filter: 'created_at' + start_date + ',created_at' + end_date
	})
	.then((answersResults) => {

		let answers = answersResults.data;
		answers.forEach(answer => {
			indexedCompany[answer.answerable_id] = answer.answer;
		});

		// all additional pages of title
		const numberOfCompanyPages = answersResults.last_page;
		let companyPromises = [];

		for (var page = 2; page < (numberOfCompanyPages + 1); page++) {
			companyPromises.push(
				classy.questions.listAnswers(company_question_id, {
					token: 'app',
					page: page,
					filter: 'created_at' + start_date + ',created_at' + end_date
				})
			);
		};
		
		return Promise.all(companyPromises);
	})
	.then((companyResults) => {
		companyResults.forEach(function(arrayofCompaniesPerPage) {

			var arrayofCompanies = arrayofCompaniesPerPage.data;
			arrayofCompanies.forEach(function(answer, index) {
				indexedCompany[answer.answerable_id] = answer.answer;
			})
			
		});
	})
	
};

module.exports = buildCustomCompanyHash;

