/* 
- GET org/id/campaigns (used for campaign names).  
- Org/id/transactions returns only campaign_id but not the campaign name, ?with=campaign does not work, so this uses fewest API calls.  Reference the name with campaign id when iterating through all transactions.
*/
classy = require('./classy-build');

/* builds a campaign hash for all active campaigns:
	{ campaign id: campaign name,
		campaign id: campaign name, 
		...
	}
*/
var buildCampaign = function(campaignIdKeyNameValue) {

	return classy.organizations.listCampaigns(34, {
		token: 'app',
		filter: 'status=active'
	})

	.then((response) => {

		let campaigns = response.data;
		campaigns.forEach((campaign) => {
			campaignIdKeyNameValue[campaign.id] = campaign.name;
			console.log("test: ", campaignIdKeyNameValue);
		});

		// all additional pages of campaigns
		const numberofCampaignPages = response.last_page;
		let campaignPromises = [];

		for (var page = 2; page < (numberofCampaignPages + 1); page++) {
			campaignPromises.push(
				classy.organizations.listCampaigns(34, {
					token: 'app',
					filter: 'status=active'
				})
			);
		};

		return Promise.all(campaignPromises);
	})

	.then((results) => {
		results.forEach(function(arrayofCampaignsPerPage) {
			var arrayofCampaigns = arrayofCampaignsPerPage.data;
			arrayofCampaigns.forEach(function(campaign, index) {
				campaignIdKeyNameValue[campaign.id] = campaign.name;
			})
		});
	})

		
};

// send this campaign reference object back to main.js
module.exports = buildCampaign;