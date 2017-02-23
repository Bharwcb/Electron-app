const remote = require('electron').remote;
const main = remote.require('./main.js');

const button = document.createElement('button');
button.textContent = 'Generate CSV (with Present Date Range)';
button.addEventListener('click', () => {
	main.generateCSV();
});
document.body.appendChild(button);