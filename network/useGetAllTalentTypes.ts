import CONSTANTS from '@constants/constants';
import SearchParamEnum from '@models/enums/SearchParamEnum';
import { useQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetAllTalentTypes() {
	const getAllData = async () => {
		const response = await server.get(CONSTANTS.endpoints.populate_data(SearchParamEnum.Profession));
		return response.data;
	};

	const call = useQuery({
		queryKey: ['useGetAllTalentTypes'],
		queryFn: getAllData,
	});

	return call;
}
