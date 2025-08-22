import CONSTANTS from '@constants/constants';
import { useQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export const useGetBankIfsc = () => {
	const { data, isLoading, error } = useQuery({
		queryKey: ['bankIfsc'],
		queryFn: () => server.get(CONSTANTS.endpoints.search_bank_ifsc),
	});

	return { data, isLoading, error };
};
