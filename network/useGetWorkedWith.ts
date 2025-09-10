import CONSTANTS from '@constants/constants';
import { useQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetWorkedWith() {
	const getAllData = () => server.get(CONSTANTS.endpoints.worked_with);

	const call = useQuery({
		queryKey: ['useGetWorkedWith'],
		queryFn: getAllData,
	});

	return call;
}
