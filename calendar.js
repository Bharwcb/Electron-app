// Calendar.js manages the start and end calendars and button to generate CSV

const moment = require('moment');

let start_date;
let end_date;

module.exports = {
	setup: function() {
		flatpickr("#flatpickr-start", {
			altInput: true,
			minDate: "2016-10-1",
			maxDate: new Date(),
			enableTime: true,
			inline: true,
			onChange: (selectedStart) => {
				start_date = selectedStart;
			}
		});
		flatpickr("#flatpickr-end", {
			altInput: true,
			maxDate: new Date(),
			enableTime: true,
			inline: true,
			onChange: (selectedEnd) => {
				end_date = selectedEnd;
			}
		})
	},

	// Export dates in calendars at time of button click to generate_csv.js file and run reports=
	generateCSVbutton:	function() {
		start_date = new Date(start_date);
		start_date = moment(start_date).format();
		end_date = new Date(end_date);
		end_date = moment(end_date).format();
		// protencts against no dates input - new Date("") = "Invalid date"
		if ((start_date ==  "Invalid date") || (end_date == "Invalid date")) {
			alert("'From' & 'To' Dates Must Be Entered Before Generating Your CSV.");
		} else {
			require('./generate_csv').generateCSV(start_date, end_date);
		}
	}

}


	
	
	

