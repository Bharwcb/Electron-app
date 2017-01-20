classy = require('./classy-build');

// ~~ Start of Additional Requests ~~ 
var buildCustomSuffixHash = function(indexedSuffix, time_filter, suffix_question_id) {

	return classy.questions.listAnswers(suffix_question_id, {
		token: 'app',
		filter: 'created_at' + time_filter
	})
	.then((answersResults) => {

		let answers = answersResults.data;
		answers.forEach(answer => {
			indexedSuffix[answer.answerable_id] = answer.answer;
		});

		// all additional pages of title
		const numberOfSuffixPages = answersResults.last_page;
		let suffixPromises = [];

		for (var page = 2; page < (numberOfSuffixPages + 1); page++) {
			suffixPromises.push(
				classy.questions.listAnswers(suffix_question_id, {
					token: 'app',
					page: page,
					filter: 'created_at' + time_filter
				})
			);
		};
		
		return Promise.all(suffixPromises);
	})
	.then((suffixResults) => {
		suffixResults.forEach(function(arrayofSuffixesPerPage) {

			var arrayofSuffixes = arrayofSuffixesPerPage.data;
			arrayofSuffixes.forEach(function(answer, index) {
				indexedSuffix[answer.answerable_id] = answer.answer;
			})
			
		});
	})
	
};

module.exports = buildCustomSuffixHash;

