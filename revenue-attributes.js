module.exports = {
	fetchAttributes: function(transaction, revenueData, indexedCompany) {
		
		let transaction_id = transaction.id;

		let account_system = "SHC Account";

		let constituent = null;

		let lookup_id = null;

		// last/org/group/household name - if company name given, enter company name - otherwise, use full name
		let last_org = null;
		console.log("transaction id: ", transaction_id);
		console.log("company name: ", indexedCompany.transaction_id);

		// this is not detecting "A Sample Company";


		// if ((indexedCompany.transaction_id != '') && (indexedCompany.transaction_id != null)) {
		// 	last_org = "Valid company name";
		// }
		// console.log("Indexed company: ", indexedCompany);


		revenueData.push([account_system, constituent, lookup_id, "last_org"]);
	}
};