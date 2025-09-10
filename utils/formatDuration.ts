export const formatDuration = (time: number | string) => {
	if (typeof time !== 'number') {
		return time;
	}
	const minutes = Math.floor(time / 60);
	const remainingSeconds = time % 60;
	return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};
