import server from './axios';
import { AxiosRequestConfig } from 'axios';

const fetcher = async (url: string, config?: AxiosRequestConfig): Promise<any> => {
	const response = await server.request({
		url,
		method: config?.method || 'get',
		...config,
	});
	return response.data?.data || response.data;
};

export default fetcher;
