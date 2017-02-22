/* 
1st, build indexed custom title hash to avoid hitting custom questoins api for every transactions..  just do it once.
then, when iterating through transactions, if doesn't find that transaction.id in customTitle hash, means they didn't enter it, doesn't set it
{
	12345: 'Mr.',
	23456: 'Mrs.'
}
*/

classy = require('../classy-build');

// ~~ Start of Additional Requests ~~ 
var buildCustomTitleHash = function(indexedTitle, start_date, end_date, title_question_id) {
	return classy.questions.listAnswers(title_question_id, {
		token: 'app',
		filter: 'created_at>' + start_date + ',created_at<' + end_date
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
				classy.questions.listAnswers(title_question_id, {
					token: 'app',
					page: page,
					filter: 'created_at>' + start_date + ',created_at<' + end_date
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

