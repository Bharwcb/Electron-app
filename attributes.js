module.exports = {
	fetchAttributes: function(transaction, classyData, indexedTitle, indexedMiddlename, indexedCompany, indexedSuffix) {
		
		// contact ID - not used for import

		// custom q
		let title = indexedTitle[transaction.id];

		let last_name = transaction.billing_last_name;

		let first_name = transaction.billing_first_name;
	
		// custom q
		let middle_name = indexedMiddlename[transaction.id];
		// custom q
		let company_name = indexedCompany[transaction.id];
		// custom q
		let suffix = indexedSuffix[transaction.id];

		let billing_email = transaction.member_email_address;

		let phone = transaction.member_phone;

		let street1 = transaction.billing_address1;

		let street2 = transaction.billing_address2;

		let city = transaction.billing_city;

		let state = transaction.billing_state;

		let zip = transaction.billing_postal_code;

		let country = transaction.billing_country;

		// member id - not used for import

		// campaign title - use transaction.campaign_id, then additional campaign fetch to get its name

		// form title - not used for import

		let net_transaction_amount = transaction.overhead_net_amount;

		// format transaction_date to take date from purchased_at
		let transaction_date = transaction.purchased_at;
		let date = new Date(transaction_date);
		date.setDate(date.getDate());
		transaction_date = ('0' + (date.getMonth() + 1)).slice(-2) + '/' + ('0' + date.getDate()).slice(-2) + '/' + date.getFullYear();
		
		// gift type

		// temple name
		
		// designee 1 administrative name

		// origin of gift - not used for import

		// payment method - DO NOT THINK SINGLE TRANSACTIONS STORE CC TYPE. cc_type only for recurring donations.

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


		// Sender Title - not used for import/dupe

		// Sender First Name - not used for import/dupe

		// Sender Last Name - not used for import/dupe

		// Sender Address 1 - not used for import/dupe

		// Sender Address 2 - not used for import/dupe

		// Sender City - not used for import/dupe

		// Sender State - not used for import/dupe

		// Sender Zip - not used for import/dupe

		// Sender Country - not used for import/dupe

		// Source Code Type - not used for import/dupe

		// Source Code Text - not used for import/dupe

		// Sub Source Code Text - not used for import/dupe

		// Name of Staff Member - not used for import/dupe

		// Donation Comment - not used for import/dupe

		// Store Name - not used for import/dupe


		// !!! template for adding an attribute (each row is an array, using Fast CSV module): classyData.push(new Array(transaction.member_id.toString()));
		classyData.push(["contact ID", title, last_name, first_name, middle_name, company_name, suffix, billing_email, phone, street1, street2, city, state, zip, country, "member ID", "campaign title", "form title", net_transaction_amount, transaction_date, "gift type", "temple name", "designee 1 administrative name", "origin of gift", "payment_method", "settlement_status", "billing_last_name", "billing_first_name", "billing_middle_name", "billing_suffix", "billing street1", "billing street2", "billing city", "billing state", "billing zip", "billing phone", "is honor gift", "tribute first name", "tribute last name", "sender title", "sender first name", "sender last name", "sender address 1", "sender address 2", "sender city", "sender state", "sender zip", "sender country", "source code type", "source code text", "sub source code text", "name of staff member", "donation comment", "store name"]);
	}
};



/*
answers = [
	{
    "question_id": 46362,
    "answer": "Miss", ...
  },
  {
		"question_id": 12345,
    "answer": "asgdasg", ...
  }
]  
*/