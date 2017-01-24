classy = require('./classy-build');

// ~~ Start of Additional Requests ~~ 
var buildCustomMiddlenameHash = function(indexedMiddlename, start_date, end_date, middlename_question_id) {

	return classy.questions.listAnswers(middlename_question_id, {
		token: 'app',
		filter: 'created_at>' + start_date + ',created_at<' + end_date
	})
	.then((answersResults) => {

		let answers = answersResults.data;
		answers.forEach(answer => {
			indexedMiddlename[answer.answerable_id] = answer.answer;
		});

		// all additional pages of title
		const numberOfMiddlenamePages = answersResults.last_page;
		let middlenamePromises = [];

		for (var page = 2; page < (numberOfMiddlenamePages + 1); page++) {
			middlenamePromises.push(
				classy.questions.listAnswers(middlename_question_id, {
					token: 'app',
					page: page,
					filter: 'created_at>' + start_date + ',created_at<' + end_date
				})
			);
		};
		
		return Promise.all(middlenamePromises);
	})
	.then((middlenameResults) => {
		middlenameResults.forEach(function(arrayofMiddlenamePerPage) {

			var arrayofMiddlename = arrayofMiddlenamePerPage.data;
			arrayofMiddlename.forEach(function(answer, index) {
				indexedMiddlename[answer.answerable_id] = answer.answer;
			})
			
		});
	})
	
};

module.exports = buildCustomMiddlenameHash;

