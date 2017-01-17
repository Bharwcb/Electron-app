module.exports = {
	fetchAttributes: function(transaction, classyData) {
		// contact ID - Classy does not collect, not used for import

		// title - CUSTOM QUESTION? 

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

		// member id - not used for import

		// campaign title - use transaction.campaign_id, then additional campaign fetch to get its name

		// form title - not used for import

		let net_transaction_amount = transaction.overhead_net_amount || "net_transaction_amount";

		// format transaction_date to take date from purchased_at
		let transaction_date = transaction.purchased_at;
		if (transaction_date == null || transaction_date == "") {
		    transaction_date = "transaction_date";
		} else {
			let date = new Date(transaction_date);
			date.setDate(date.getDate());
			transaction_date = ('0' + (date.getMonth() + 1)).slice(-2) + '/' + ('0' + date.getDate()).slice(-2) + '/' + date.getFullYear();
		};

		// gift type

		// temple name
		
		// designee 1 administrative name

		// origin of gift - not used for import

		// payment method - cc_type only for recurring donations, how else to get CC type?

		// Settlement Status - not used for import/dupe

		// Billing Last Name - not used for import/dupe

		// Billing First Name - not used for import/dupe

		// Billing Middle Name - not used for import/dupe

		// Billing Suffix - not used for import/dupe

		// Billing Street1 - not used for import/dupe

		// Billing Street2 - not used for import/dupe

		// Billing City - not used for import/dupe

		// Billing State - not used for import/dupe

		// Billing Zip - not used for import/dupe

		// Billing Phone - not used for import/dupe

		// Is Honor Gift - not used for import/dupe

		// tribute first name

		// tribute last name


		// Sender Title

		// Sender First Name

		// Sender Last Name

		// Sender Address 1

		// Sender Address 2

		// Sender City

		// Sender State

		// Sender Zip

		// Sender Country

		// Source Code Type

		// Source Code Text

		// Sub Source Code Text

		// Name of Staff Member

		// Donation Comment

		// Store Name


		// !!! template for adding an attribute (each row is an array, using Fast CSV module): classyData.push(new Array(transaction.member_id.toString()));
		classyData.push(["contact ID", "title", last_name, first_name, "middle_name", "company_name", "suffix", billing_email, phone, street1, street2, city, state, zip, country, "member ID", "campaign title", "form title", net_transaction_amount, transaction_date, "gift type", "temple name", "designee 1 administrative name", "origin of gift", "payment_method", "settlement_status", "billing_last_name", "billing_first_name", "billing_middle_name", "billing_suffix", "billing street1", "billing street2", "billing city", "billing state", "billing zip", "billing phone", "is honor gift", "tribute first name", "tribute last name", "sender title", "sender first name", "sender last name", "sender address 1", "sender address 2", "sender city", "sender state", "sender zip", "sender country", "source code type", "source code text", "sub source code text", "name of staff member", "donation comment", "store name"]);
	}
};



/*
	let last_name = transaction.billing_last_name || "last_name";

	~~ is short for.. ~~

	let last_name = transaction.billing_last_name;
	if (last_name == null || last_name == "") {
	    last_name = "last_name";
	};
*/