var module.exports = {
	start_time: flatpickr("#flatpickr-start", {
		minDate: "2016-10-1",
		enableTime: true,
		onChange: (selectedDate) => {
			// export start time to generate_csv.js
			console.log("selected date: ", selectedDate);
			return selectedDate;
		}
	}),

	end_time: flatpickr("#flatpickr-end", {
		maxDate: new Date(),
		enableTime: true
	})

};

// set end to be + 1 day? 
// need to figure out how to set variable to what's inputted