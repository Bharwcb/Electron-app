// Calendar.js manages the start and end calendars and button to generate CSV

let start_date;
let end_date;

module.exports = {
	everything: function() {
		const generate_file = require('./generate_csv');

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
		})
	},

	// fires off with click "Generate CSV" button
	// 1) whatever start & end dates are set to in calendar at time of button click, export that to generate_csv.js and run reports
	generateCSVbutton:	function() {
		console.log("start date: ", start_date);
		console.log("end date: ", end_date);

		// if generate_file works above, could just run...

		// generate_file.generateCSV();
	}

}


// module.exports = {
		// 	start_date: function() {
		// 		return start_date;
		// 	},
		// 	end_date: function() {
		// 		return end_date;
		// 	}H
		// }


	
	
	

