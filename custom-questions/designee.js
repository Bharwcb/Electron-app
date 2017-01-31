// 'Designee 1 Administrative Name' is the hospital code and will be selected as a dropdown custom question.

classy = require('../classy-build');

// temple name will be a drop down 
var buildDesigneeHash = function(indexedDesignee, start_date, end_date, designee_question_id) {

	return classy.questions.listAnswers(designee_question_id, {
		token: 'app',
		filter: 'created_at>' + start_date + ',created_at<' + end_date
	})
	.then((answersResults) => {

		let answers = answersResults.data;
		answers.forEach(answer => {
			indexedDesignee[answer.answerable_id] = answer.answer;
			// builds hash with transaction_id: answer
		});

		// all additional pages of title
		const numberOfDesigneePages = answersResults.last_page;
		let designeePromises = [];

		for (var page = 2; page < (numberOfDesigneePages + 1); page++) {
			designeePromises.push(
				classy.questions.listAnswers(designee_question_id, {
					token: 'app',
					page: page,
					filter: 'created_at>' + start_date + ',created_at<' + end_date
				})
			);
		};
		
		return Promise.all(designeePromises);
	})
	.then((designeeResults) => {
		designeeResults.forEach(function(arrayofDesigneePerPage) {

			var arrayofDesignee = arrayofDesigneePerPage.data;
			arrayofDesignee.forEach(function(answer, index) {
				indexedDesignee[answer.answerable_id] = answer.answer;
			})
			
		});
	})
	
};

module.exports = buildDesigneeHash;