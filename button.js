console.log("get here");

flatpickr("#flatpickr-start", {
	minDate: "2016-10-1",
	enableTime: true
});

flatpickr("#flatpickr-end", {
	maxDate: new Date(),
	enableTime: true
});

