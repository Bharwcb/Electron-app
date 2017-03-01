// Calendar.js manages the start and end calendars and button to generate CSV

let start_date;
let end_date;


module.exports = {
	setup: function() {
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

	// Export dates in calendars at time of button click to generate_csv.js file and run reports=
	generateCSVbutton:	function() {
		require('./generate_csv').generateCSV(start_date, end_date);
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


	
	
	

