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

// click "Generate CSV" button

	// export start and end dates to generate_csv.js
	
	

