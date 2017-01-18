module.exports = {
	fetchTitle: function(transactionResults) {
		let title_question_id = "46362";
		let customAnswers = transactionResults.answers;
		console.log("GETS HERE");
		// goes through every transaction, and checks if there are custom answers
		if (customAnswers.length > 0) {

			// if there are, iterate through each answer object
			customAnswers.forEach(function(answer, index) {
				// and check if it has the title question_id
				if (answer["question_id"] == title_question_id) {
					// console.log("BEEP BEEP BEEP!  TITLE QUESTION DETECTED");
					// if found, it means this is the custom answer object for title. return the value of 'answer' key.
					// console.log(answer["answer"]);
				};

			});
		};
	}
}