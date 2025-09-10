import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import constants from '../constants/constants';
import { AuthStorage } from './storage';
// import MockAdapter from 'axios-mock-adapter';

const server: AxiosInstance = axios.create({
	baseURL: constants.BASE_URL,
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
});

server.interceptors.request.use(
	// @ts-ignore
	(config: AxiosRequestConfig) => {
		if (config.headers?.Authorization) return config;
		const authToken = AuthStorage.getString('auth_token');
		if (authToken) {
			config.headers!.Authorization = `Bearer ${authToken}`;
		}
		return config;
	},
	(error: any) => {
		return Promise.reject(error);
	},
);

server.interceptors.response.use(
	response => {
		return response;
	},
	(error: any) => {
		if (error.response) {
			// console.log('REQUEST: ', JSON.stringify(error.request, null, 2));
			// console.log('RESPONSE: ', JSON.stringify(error.response, null, 2));
			return error.response;
		} else {
			return Promise.reject(error.message);
		}
	},
);

/*const mock = new MockAdapter(server, { delayResponse: 1000 });

mock.onGet('/tester').reply(200, {
	users: [{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Doe' }],
})

mock.onAny().passThrough();
*/

export default server;
