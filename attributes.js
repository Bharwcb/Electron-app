module.exports = {
	fetchAttributes: function(transaction, classyData) {
		// contact ID - Classy does not collect

		// title - Classy does not collect

		let last_name = transaction.billing_last_name || "last_name";

		let first_name = transaction.billing_first_name || "first_name";
	
		// middle name - custom question

		// company name - mike checking how shriners wants to use.. 



		// !!! template for adding an attribute (each row is an array, using Fast CSV module): classyData.push(new Array(transaction.member_id.toString()));
		classyData.push(new Array("contact ID", "title", last_name, first_name, "middle_name", "company_name"));
	}
};