export function getRelativeTime(timestamp: string): string {
	if (!timestamp) {
		return '';
	}
	const now = new Date();
	const time = new Date(timestamp);
	const diffInMilliseconds = now.getTime() - time.getTime();
	const diffInSeconds = diffInMilliseconds / 1000;
	const diffInMinutes = diffInSeconds / 60;
	const diffInHours = diffInMinutes / 60;
	const diffInDays = diffInHours / 24;

	if (diffInSeconds < 60) {
		return `${Math.round(diffInSeconds)} seconds ago`;
	} else if (diffInMinutes < 60) {
		return `${Math.round(diffInMinutes)} minutes ago`;
	} else if (diffInHours < 24) {
		return `${Math.round(diffInHours)} hours ago`;
	} else if (Math.floor(diffInDays) === 0) {
		return 'Today';
	} else if (Math.floor(diffInDays) === 1) {
		return 'Yesterday';
	} else {
		return `${Math.floor(diffInDays)} days ago`;
	}
}
