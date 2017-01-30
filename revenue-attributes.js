module.exports = {
	fetchAttributes: function(transaction, revenueData, indexedCompany, indexedMiddlename, indexedTitle, indexedSuffix, campaignIdKeyNameValue) {
		
		let transaction_id = transaction.id;

		let account_system = "SHC Account";

		let constituent = null;

		let lookup_id = null;

		// ~~~ last_org ~~~
		let last_org = null;
		let company_name = indexedCompany[transaction_id];
		let first_name = transaction.billing_first_name;
		let last_name = transaction.billing_last_name;
		let middle_name = indexedMiddlename[transaction_id];
		let title = indexedTitle[transaction_id];
		let suffix = indexedSuffix[transaction_id];
		let full_name = [];
		// if there's a company given, set last_org to company
		if (( typeof company_name !== 'undefined' ) && ( company_name !== "" )) {
			last_org = company_name;
		} else {
			// if no company name, set last_org to full name 
			if (nameExists(first_name, last_name)) {
				full_name.push(title, first_name, middle_name, last_name, suffix);
				// if last name OR first name isn't given (only possible with transactions via the API), or for some strange reason there's a first name, middle name, and suffix, but no last name, etc.. use whatever is provided by filtering out nulls
				full_name.filter(function(val) { return val !== null; });
				last_org = full_name.join(" ");
			}
		};
		// ~~~ last_org end ~~~

		let address = transaction.billing_address1;
		if (transaction.billing_address2 !== null) {
			address = address + " " + transaction.billing_address2;
		}

		let city = transaction.billing_city;

		let state = transaction.billing_state;

		let zip = transaction.billing_postal_code;

		let country = transaction.billing_country;

		let phone = transaction.member_phone;

		let email = transaction.member_email_address;

		let amount = transaction.donation_net_amount;

		let transaction_date = transaction.purchased_at;
		let date = new Date(transaction_date);
		date.setDate(date.getDate());
		transaction_date = ('0' + (date.getMonth() + 1)).slice(-2) + '/' + ('0' + date.getDate()).slice(-2) + '/' + date.getFullYear();

		// REFUNDED TRANSACTIONS ARE NOT SHOWING UP.. FILTERING ONLY SUCCESSFUL - WILL NOT WORK. CHECKING WITH PRODOR
		let revenue_type = 'refund';
		if (transaction.refunded_at == null) {
			revenue_type = 'payment';
		};

		// OPEN TICKET TO EXPOSE 'CARD_TYPE' ENDPOINT
		let payment_method = transaction.card_type;

		// CHECK WITH PRODOR
		let inbound_channel = 'INBOUND_CHANNEL_PLACEHOLDER';

		// SLACKED TORI TO CONFIRM PRODOR'S LOGIC IS CORRECT IN ALL CASES	
		// in meantime, submitted ticket #1247
		let application = 'APPLICATION_PLACEHOLDER';

		let appeal = campaignIdKeyNameValue[transaction.campaign_id];

		revenueData.push([account_system, constituent, lookup_id, last_org, first_name, middle_name, title, suffix, address, city, state, zip, country, phone, email, amount, transaction_date, revenue_type, payment_method, inbound_channel, application, appeal]);

		function nameExists(first_name, last_name) {
			if ((first_name !== null) || (last_name !== null)) {
				return true;
			} else {
				return false;
			}
		};

	}
};