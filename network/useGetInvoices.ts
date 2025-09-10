import CONSTANTS from '@constants/constants';
import { useAuth } from '@presenters/auth/AuthContext';
import { useInfiniteQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetInvoices(projectId?: UniqueId, month?: number, year?: number) {
	const { loginType } = useAuth();
	const owner_type = loginType === 'producer' ? 'producer' : 'talent';

	const getAllData = async ({ pageParam }: { pageParam: number }) => {
		const response = await server.get(CONSTANTS.endpoints.get_invoices(owner_type, pageParam, projectId, month, year));
		return response.data;
	};

	const call = useInfiniteQuery({
		queryKey: ['useGetInvoices', owner_type, projectId, month, year],
		queryFn: getAllData,
		initialPageParam: 1,
		enabled: Boolean(owner_type),
		getNextPageParam: (lastPage, allPages) => {
			if (!lastPage?.success || !lastPage?.data || lastPage?.data?.length < 10) {
				return undefined;
			}
			return allPages.length + 1;
		},
		select: res => res?.pages?.flatMap(page => page?.data) || [],
	});

	return call;
}
