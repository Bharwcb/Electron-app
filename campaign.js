// GET transaction/id to fetch campaign.name

classy = require('./classy-build');

var fetchCompanyName = function(time_filter, transaction_id) {

	return classy.transactions.retrieve("each trans id", {
		token: 'app'
	})

};

module.exports = fetchCompanyName;