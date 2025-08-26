export const getReporterId = (loginType: string, producerId?: string, userId?: string) => {
	return loginType === 'producer' ? producerId : userId;
};
