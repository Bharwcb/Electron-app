classy = require('./classy-build');

// temple name will be a drop down 
var buildTempleNameHash = function(indexedTempleName, start_date, end_date, temple_name_question_id) {

	return classy.questions.listAnswers(temple_name_question_id, {
		token: 'app',
		filter: 'created_at>' + start_date + ',created_at<' + end_date
	})
	.then((answersResults) => {

		let answers = answersResults.data;
		answers.forEach(answer => {
			indexedTempleName[answer.answerable_id] = answer.answer;
			// builds hash with transaction_id: answer
		});

		// all additional pages of title
		const numberOfTempleNamePages = answersResults.last_page;
		let templeNamePromises = [];

		for (var page = 2; page < (numberOfTempleNamePages + 1); page++) {
			templeNamePromises.push(
				classy.questions.listAnswers(temple_name_question_id, {
					token: 'app',
					page: page,
					filter: 'created_at>' + start_date + ',created_at<' + end_date
				})
			);
		};
		
		return Promise.all(templeNamePromises);
	})
	.then((templeNameResults) => {
		templeNameResults.forEach(function(arrayofTempleNamePerPage) {

			var arrayofTempleName = arrayofTempleNamePerPage.data;
			arrayofTempleName.forEach(function(answer, index) {
				indexedTempleName[answer.answerable_id] = answer.answer;
			})
			
		});
	})
	
};

module.exports = buildTempleNameHash;