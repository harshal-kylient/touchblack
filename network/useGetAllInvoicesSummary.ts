import CONSTANTS from '@constants/constants';
import { useAuth } from '@presenters/auth/AuthContext';
import { useQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetAllInvoicesSummary(projectId?: UniqueId, month?: number, year?: number) {
	const { loginType } = useAuth();

	const getInvoicesSummary = async () => {
		const response = await server.get(CONSTANTS.endpoints.get_invoice_details(loginType!, projectId, month, year));
		return response.data.data;
	};

	const query = useQuery({
		queryKey: ['useGetAllInvoicesSummary', loginType, projectId, month, year],
		queryFn: getInvoicesSummary,
		enabled: !!loginType,
	});
	return query;
}
