// module.exports = {
// 	fetchTitle: function(classy) {

// 		classy.questions.listAnswers(46362, {
// 		token: 'app',
// 		per_page: '1'
// 	}).then((answersResults) => {
// 		let answers = answersResults.data;
// 		answers.forEach(answer => {
// 			indexedTitle[answer.answerable_id] = answer.answer;
// 		});

// 		// all additional pages of title
		
// 		const numberOfTitlePages = answersResults.last_page;
// 		let titlePromises = [];

// 		for (var page = 2; page < (numberOfTitlePages + 1); page++) {
// 			titlePromises.push(
// 				classy.questions.listAnswers(46362, {
// 					token: 'app',
// 					per_page: '1',
// 					page: page
// 				})
// 				);
// 		}

// 		Promise.all(titlePromises).then((titleResults) => {
// 			console.log("title results", titleResults);
// 		}).catch((error) => {
// 			console.log("ERROR IN ANSWERS OTHER PAGES", error);
// 		})

// 	}).catch((error) => {
// 		console.log("ERROR IN ANSWERS FIRST PAGE: ", error);
// 	});
// // ~~ End of Additional Requests
// 	}
// }