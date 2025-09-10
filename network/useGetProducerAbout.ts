import CONSTANTS from '@constants/constants';
import { useAuth } from '@presenters/auth/AuthContext';
import fetcher from '@utils/fetcher';
import useSWR from 'swr';

export default function useGetProducerAbout() {
	const { producerId } = useAuth();
	const { data, isLoading, error } = useSWR(CONSTANTS.endpoints.producer_about(producerId!), fetcher);
	return { data, isLoading, error };
}
