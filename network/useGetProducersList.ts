import CONSTANTS from '@constants/constants';
import useSWR from 'swr';

export default function useGetProducersList() {
	return useSWR(CONSTANTS.endpoints.producers_list);
}
