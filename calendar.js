// Calendar.js manages the start and end calendars and button to generate CSV

const generate_file = require('./generate_csv');
let start_date;
let end_date;

flatpickr("#flatpickr-start", {
	minDate: "2016-10-1",
	enableTime: true,
	onChange: (selectedStart) => {
		start_date = selectedStart;
	}
});

flatpickr("#flatpickr-end", {
	maxDate: new Date(),
	enableTime: true,
	onChange: (selectedEnd) => {
		end_date = selectedEnd;
	}
});

function generateCSV() {
	// fires off with click "Generate CSV" button

	// 1) whatever start & end dates are set to at time of button click, export that to generate_csv.js
	// console.log("start date: ", start_date);
	// console.log("end date: ", end_date);
	module.exports = {
		start_date: function() {
			return start_date;
		},
		end_date: function() {
			return end_date;
		}
	}

	// 2) need to run 'node generate_csv.js' somehow to see if start date in generate_csv.js line 65 works.
	generate_file.generateCSV();



}


	
	
	

