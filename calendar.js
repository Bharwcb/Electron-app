// Calendar.js manages the start and end calendars and button to generate CSV

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
	// whatever start & end dates are set to at time of button click, export that to generate_csv.js

	// then run generate_csv.exportCSVtoMain();???
}


	
	
	

