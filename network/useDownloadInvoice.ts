import { useQuery } from '@tanstack/react-query';
import CONSTANTS from '@constants/constants';
import server from '@utils/axios';

const useDownloadInvoice = (invoiceId: string) => {
	return useQuery({
		queryKey: ['downloadInvoice', invoiceId],
		queryFn: async () => {
			const response = await server.get(CONSTANTS.endpoints.download_invoice(invoiceId));
			return response.data;
		},
		enabled: false,
	});
};

export default useDownloadInvoice;
