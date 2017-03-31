var Classy = require('classy-node');

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
