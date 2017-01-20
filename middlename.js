classy = require('./classy-build');

// ~~ Start of Additional Requests ~~ 
var buildCustomMiddlenameHash = function(indexedMiddlename, time_filter) {

	return classy.questions.listAnswers(46362, {
		token: 'app',
		filter: 'created_at' + time_filter
	})
	.then((answersResults) => {

		let answers = answersResults.data;
		answers.forEach(answer => {
			indexedTitle[answer.answerable_id] = answer.answer;
		});

		// all additional pages of title
		const numberOfTitlePages = answersResults.last_page;
		let titlePromises = [];

		for (var page = 2; page < (numberOfTitlePages + 1); page++) {
			titlePromises.push(
				classy.questions.listAnswers(46362, {
					token: 'app',
					page: page,
					filter: 'created_at' + time_filter
				})
			);
		};
		
		return Promise.all(titlePromises);
	})
	.then((titleResults) => {
		titleResults.forEach(function(arrayofTitlesPerPage) {

			var arrayofTitles = arrayofTitlesPerPage.data;
			arrayofTitles.forEach(function(answer, index) {
				indexedTitle[answer.answerable_id] = answer.answer;
			})
			
		});
	})
	
};

module.exports = buildCustomTitleHash;

