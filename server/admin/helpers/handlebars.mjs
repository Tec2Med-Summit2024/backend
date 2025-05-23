const handlebars = {
	fmtDate: (date) => {
		return new Date(date).toLocaleTimeString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
		});
	},
	eq: (v1, v2) => v1 === v2,
	contains: (list, val) => {
		if (!list) {
			return false;
		}
		if (Array.isArray(list)) {
			return list.map(x => x.trim()).includes(val);
		}
		if (typeof list === 'string') {
			try {
				const parsed = JSON.parse(list);
				if (Array.isArray(parsed)) {
					return parsed.map(x => x.trim()).includes(val);
				}
			} catch (e) {
				console.log('Not JSON, treating as comma-separated');
				// If not JSON, treat as comma-separated string
				return list.split(',').map(x => x.trim()).includes(val);
			}
		}
		return false;
	},
	array: function() {
		return Array.prototype.slice.call(arguments, 0, -1);
	},
	json: (context) => JSON.stringify(context, null, 2),
	typeof: (value) => typeof value,
	isChecked: (array, value) => {
		if (!array) return '';
		if (!Array.isArray(array)) array = [array];
		return array.includes(value) ? 'checked' : '';
	}
};

export default handlebars;