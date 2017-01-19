/* 

Lets make any request for custom answer a function, then have a separate file for populating the indexed Title hash.

So for example,

/custom-answers directory
- title.js:  uses it to build the indexedTitle hash
- company.js: uses it to build the indexedCompany hash
- maybe a reusable function to send the request to ALL CUSTOM QUESTIONS, just plugin the question_id, blank indexed hash, etc.

*/
classy = require('./classy-build');
app = classy.app();

// ~~ Start of Additional Requests ~~ 
var buildCustomTitleHash = function() {

	app.then(() => {
		classy.questions.listAnswers(46362, {
			token: 'app',
			filter: 'created_at' + time_filter
		}).then((answersResults) => {
			console.log("page 1 answer results: ", answersResults);
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
			
			Promise.all(titlePromises).then((titleResults) => {
				console.log("Title results pages 2 through end: ", titleResults);
				titleResults.forEach(function(arrayofTitlesPerPage) {

					var arrayofTitles = arrayofTitlesPerPage.data;
					arrayofTitles.forEach(function(answer, index) {
						indexedTitle[answer.answerable_id] = answer.answer;
					});
					// so, it's building indexed title correctly.
				});
				next();
			}).catch((error) => {
				console.log("ERROR IN ANSWERS OTHER PAGES", error);
			})

		}).catch((error) => {
			console.log("ERROR IN ANSWERS FIRST PAGE: ", error);
		});
	});
	// ~~ End of async step 1 (title).  SHOULD collect the whole indexedTitle by now.
};

module.exports = buildCustomTitleHash;

