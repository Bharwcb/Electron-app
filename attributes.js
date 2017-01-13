module.exports = {
	fetchAttributes: function() {
		// contact ID - Classy does not collect

		// title - Classy does not collect

		let last_name = transaction.billing_last_name;
		if (last_name == null || last_name == "") {
			last_name = "last_name";
		};

		let first_name = transaction.billing_first_name;
		if (first_name == null || first_name == "") {
			first_name = "first_name";
		};

		let middle_name = transaction.middle_name;
		if (middle_name == null || middle_name == "") {
			middle_name = "middle_name";
		};

		// COMPANY NAME - MIKE IS CHECKING  (transaction.company_name not the right field.. it's under custom question.  So what is transaction.company_name then???)
		let company_name = transaction.company_name;
		if (company_name == null || company_name == "") {
			company_name = "company_name";
		};
	}
};