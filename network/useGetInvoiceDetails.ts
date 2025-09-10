import CONSTANTS from '@constants/constants';
import { useAuth } from '@presenters/auth/AuthContext';
import { useQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetInvoiceDetails(projectId: UniqueId) {
	const { loginType } = useAuth();
	const getData = async () => {
		const response = await server.get(CONSTANTS.endpoints.fetch_invoice_details(loginType!, projectId));
		return response.data;
	};

	const call = useQuery({
		queryKey: ['useGetInvoiceDetails', loginType, projectId],
		queryFn: getData,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		select: res => res?.data,
	});

	return call;
}
