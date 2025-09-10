import CONSTANTS from '@constants/constants';
import server from '@utils/axios';
import { useQuery } from '@tanstack/react-query';

export default function useGetProjectMessageTemplate(projectId: UniqueId, talentId: UniqueId) {
	const endpoint = CONSTANTS.endpoints.producer_talent_message_template(projectId, talentId);
	const getData = async () => {
		const response = await server.get(endpoint);
		if (!response.data?.success) {
			return {
				message: '',
				success: true,
				data: {
					message: "Hello Vincent, Huge fans of your work! We think you'd be perfect for ‘Kapil’ in our next film. Attached is a synopsis and more details. If you are interested, then let's chat!",
					brand_name: 'IKEA',
					project_name: 'Cion - 02',
					film_type: 'Digital Ad',
					film_brief: 'Showcase how IKEA furniture and homeware solutions can seamlessly transform living spaces to create a sense of comfort, functionality, and joy for families.',
					location: 'Pune',
					dates: ['1-Apr', '2-Apr', '3-Apr', '4-Apr', '5-Apr', '6-Apr', '7-Apr', '8-Apr', '9-Apr', '10-Apr'],
					status: 'Read 14:43',
				},
			};
		}
		return response.data;
	};

	const call = useQuery({
		queryKey: ['useGetProjectMessageTemplate', projectId, talentId],
		queryFn: getData,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
	});
	return call;
}
