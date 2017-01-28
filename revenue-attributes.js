module.exports = {
	fetchAttributes: function(transaction, revenueData, indexedCompany) {
		
		let transaction_id = transaction.id;

		let account_system = "SHC Account";

		let constituent = null;

		let lookup_id = null;

		// ~~~ last_org ~~~
		let last_org = null;
		let company_name = indexedCompany[transaction_id];
		let first_name = transaction.billing_first_name;
		let last_name = transaction.billing_last_name;
		let full_name = [];
		function nameExists(first_name, last_name) {
			if ((first_name !== null) && (last_name !== null)) {
				return true;
			} else {
				return false;
			}
		};
		// if there's a company given, set last_org to company
		if (( typeof company_name !== 'undefined' ) && ( company_name !== "" )) {
			last_org = company_name;
		} else {
			// if no company name, set last_org to full name 
			if (nameExists(first_name, last_name)) {
				full_name.push(first_name, last_name);
				full_name.filter(function(val) { return val !== null; });
				// full_name = [first]
				last_org = full_name.join(" ");
			}
		};
		// ~~~ last_org end ~~~



		revenueData.push([account_system, constituent, lookup_id, last_org]);
	}
};