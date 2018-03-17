const Classy = require('classy-node');

// const jsonfile = require('jsonfile');
// const path = require('path');
// const file = path.join(__dirname, 'downloads', 'default.json');

// let creds = jsonfile.readFileSync(file);
// let id = creds.classyCredentials.id;
// let secret = creds.classyCredentials.secret;
	
var classy = new Classy({
	baseUrl: 'https://stagingapi.stayclassy.org',
	clientId: "{{add_env_key}}",
	clientSecret: "{{add_env_secret}}",
	requestDebug: false
});

module.exports = classy;