classy = require('./classy-build');

// ~~ Start of Additional Requests ~~ 
var buildCustomMiddlenameHash = function(indexedMiddlename, time_filter, middlename_question_id) {

	return classy.questions.listAnswers(middlename_question_id, {
		token: 'app',
		filter: 'created_at' + time_filter
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
					filter: 'created_at' + time_filter
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

