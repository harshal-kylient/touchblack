import moment from 'moment';

export function formatTimestampForDay(timestamp: string): string {
	if (!timestamp) {
		return '';
	}

	const formattedTimestamp = moment(timestamp).format('DD-MM-YYYY');
	const today = moment().format('DD-MM-YYYY');
	const yesterday = moment().subtract(1, 'days').format('DD-MM-YYYY');

	if (formattedTimestamp === today) {
		return 'Today';
	} else if (formattedTimestamp === yesterday) {
		return 'Yesterday';
	} else {
		return moment(timestamp).format('DD-MMM-YYYY');
	}
}
