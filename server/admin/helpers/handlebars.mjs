const handlebars = {
	fmtDate: (date) => {
		return new Date(date).toLocaleTimeString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
		});
	}
}

export default handlebars;