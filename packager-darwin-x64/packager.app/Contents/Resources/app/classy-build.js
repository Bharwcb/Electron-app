var Classy = require('classy-node');

// 'config' module since 'dotenv' does not work with electron
var config = require('config');
var id = config.get('classyCredentials.id');
var secret = config.get('classyCredentials.secret');

var classy = new Classy({
	baseUrl: 'https://stagingapi.stayclassy.org',
	clientId: id,
	clientSecret: secret,
	requestDebug: false
});

module.exports = classy;
