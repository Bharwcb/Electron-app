// GET transaction/id to fetch campaign.name
classy = require('./classy-build');

var fetchCampaignTitle = function(transaction_id) {

	return classy.transactions.retrieve(transaction_id, {
		token: 'app'
	})

	.then((transactionResponse) => {
		let campaignTitle = transactionResponse.campaign.name;

		// CAMPAIGN TITLE WORKS HERE, JUST NEED TO RETURN IT AND SEND BACK TO MAIN.JS
		console.log("transaction_id: ", transaction_id);
		console.log("campaign title: ", campaignTitle);
		return campaignTitle;
	});
		
};

// and in the end, just need to send company title back to main.js
module.exports = fetchCampaignTitle;