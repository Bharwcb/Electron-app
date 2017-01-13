module.exports = {
	fetchAttributes: function(transaction, classyData) {
		// contact ID - Classy does not collect

		// title - Classy does not collect

		let last_name = transaction.billing_last_name || "last_name";

		let first_name = transaction.billing_first_name || "first_name";
	
		// middle name - custom question

		// company name - mike checking how shriners wants to use.. but most likely custom question

		// suffix - custom question

		let billing_email = transaction.member_email_address || "billing email";

		let phone = transaction.member_phone || "phone";

		let street1 = transaction.billing_address1 || "street1";

		let street2 = transaction.billing_address2 || "street2";

		let city = transaction.billing_city || "city";

		let state = transaction.billing_state || "state";

		let zip = transaction.billing_postal_code || "zip";

		let country = transaction.billing_country || "country";

		// !!! template for adding an attribute (each row is an array, using Fast CSV module): classyData.push(new Array(transaction.member_id.toString()));
		classyData.push(["contact ID", "title", last_name, first_name, "middle_name", "company_name", "suffix", billing_email, phone, street1, street2, city, state, zip, country]);
	}
};