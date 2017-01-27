module.exports = {
	fetchAttributes: function(transaction, classyData, indexedTitle, indexedMiddlename, indexedCompany, indexedSuffix, indexedTempleName, campaignIdKeyNameValue) {
		// contact ID - not used for import
		let contact_id = null;
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
		let member_id = null;
		// campaign title uses campaign object to reference its id to its name
		let campaign_title = campaignIdKeyNameValue[transaction.campaign_id];

		// form title - not used for import
		let form_title = null;

		let net_transaction_amount = transaction.donation_net_amount;

		// format transaction_date to take date from purchased_at
		let transaction_date = transaction.purchased_at;
		let date = new Date(transaction_date);
		date.setDate(date.getDate());
		transaction_date = ('0' + (date.getMonth() + 1)).slice(-2) + '/' + ('0' + date.getDate()).slice(-2) + '/' + date.getFullYear();
		
		// gift type
		let gift_type = transaction.in_honor_of; 
		if (gift_type == null || gift_type == "" || gift_type == " ") {
			gift_type = "Stand";
		} else if (gift_type.slice(0,11) == "in honor of") {
			gift_type = "Tribute";
		} else if (gift_type.slice(0,12) == "in memory of") {
			gift_type = "Memory";
		};

		// custom q
		let temple_name = indexedTempleName[transaction.id];

		// designee 1 administrative name

		// origin of gift - not used for import
		let origin_of_gift = null;

		// payment method - DO NOT THINK SINGLE TRANSACTIONS STORE CC TYPE. cc_type only for recurring donations.

		// Settlement Status - not used for import/dupe
		let settlement_status = null;
		// Billing Last Name - not used for import/dupe
		let billing_last_name = null;
		// Billing First Name - not used for import/dupe
		let billing_first_name = null;
		// Billing Middle Name - not used for import/dupe
		let billing_middle_name = null;
		// Billing Suffix - not used for import/dupe
		let billing_suffix = null;
		// Billing Street1 - not used for import/dupe
		let billing_street1 = null;
		// Billing Street2 - not used for import/dupe
		let billing_street2 = null;
		// Billing City - not used for import/dupe
		let billing_city = null;		
		// Billing State - not used for import/dupe
		let billing_state = null;
		// Billing Zip - not used for import/dupe
		let billing_zip = null;
		// Billing Phone - not used for import/dupe
		let billing_phone = null;
		// Is Honor Gift - not used for import/dupe
		let is_honor_gift = null;

		// tribute first and last name
		let tribute_first_name = null;
		let tribute_last_name = null;

		if (transaction.dedication !== null) { 
			let tribute_full_name_arr = transaction.dedication.honoree_name.split(" "); 
			tribute_first_name = tribute_full_name_arr[0];
			if (tribute_full_name_arr.length > 1) {
				tribute_last_name = tribute_full_name_arr[tribute_full_name_arr.length - 1];
			};
		};

		// Sender Title - not used for import/dupe
		let sender_title = null;
		// Sender First Name - not used for import/dupe
		let sender_first_name = null;
		// Sender Last Name - not used for import/dupe
		let sender_last_name = null;
		// Sender Address 1 - not used for import/dupe
		let sender_address1 = null;
		// Sender Address 2 - not used for import/dupe
		let sender_address2 = null;
		// Sender City - not used for import/dupe
		let sender_city = null;
		// Sender State - not used for import/dupe
		let sender_state = null;
		// Sender Zip - not used for import/dupe
		let sender_zip = null;
		// Sender Country - not used for import/dupe
		let sender_country = null;
		// Source Code Type - not used for import/dupe
		let source_code_type = null;
		// Source Code Text - not used for import/dupe
		let source_code_text = null;
		// Sub Source Code Text - not used for import/dupe
		let sub_source_code_text = null;
		// Name of Staff Member - not used for import/dupe
		let name_of_staff_member = null;
		// Donation Comment - not used for import/dupe
		let donation_comment = null;
		// Store Name - not used for import/dupe
		let store_name = null;

		// !!! template for adding an attribute (each row is an array, using Fast CSV module): classyData.push([transaction.member_id.toString()]);

		classyData.push([contact_id, title, last_name, first_name, middle_name, company_name, suffix, billing_email, phone, street1, street2, city, state, zip, country, member_id, campaign_title, form_title, net_transaction_amount, transaction_date, gift_type, temple_name, "designee 1 administrative name", origin_of_gift, "payment_method", settlement_status, billing_last_name, billing_first_name, billing_middle_name, billing_suffix, billing_street1, billing_street2, billing_city, billing_state, billing_zip, billing_phone, is_honor_gift, tribute_first_name, tribute_last_name, sender_title, sender_first_name, sender_last_name, sender_address1, sender_address2, sender_city, sender_state, sender_zip, sender_country, source_code_type, source_code_text, sub_source_code_text, name_of_staff_member, donation_comment, store_name]);
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