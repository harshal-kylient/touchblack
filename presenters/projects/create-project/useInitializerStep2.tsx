import { useEffect } from 'react';
import { useProjectsContext } from '../ProjectContext';
import useGetProjectProfessions from '@network/useGetProjectProfessions';
import EnumStatus from '@models/enums/EnumStatus';
import CONSTANTS from '@constants/constants';
import server from '@utils/axios';

export default function useInitializerStep2(reset: any) {
	const { state, dispatch } = useProjectsContext();
	const projectId = state.project_details.project_id!;

	const { data: response1 } = useGetProjectProfessions(projectId, EnumStatus.All);
	const professions = response1?.data;

	useEffect(() => {
		async function runner() {
			if (!state.project_details.project_id) {
				return;
			}

			const value: any[] = [];

			for (let i = 0; i < professions.length; i++) {
				const profession = { id: professions[i]?.id, name: professions[i]?.name };

				const response = await server.get(CONSTANTS.endpoints.project_invitation_dates(projectId, profession?.id));
				const dates = response.data?.data;

				const res = await server.get(CONSTANTS.endpoints.get_project_invitations(projectId, profession?.id));
				const success2 = res.data?.success;
				const invites = res.data?.data;

				if (success2) {
					const talents = invites?.map(it => ({
						first_name: it?.first_name,
						last_name: it?.last_name,
						id: it?.talent_id,
						profile_picture_url: it?.profile_pic_url,
						profession: profession?.id,
						profession_type: profession?.name,
						status: it?.status,
					}));

					value.push({
						dates,
						profession_id: profession,
						project_id: projectId,
						talent_ids: talents,
					});
				}
			}

			dispatch({ type: 'TALENT_SELECTION_DEFAULT', value });
			dispatch({ type: 'TALENT_SELECTION', value });
			reset({ project_invitations: value });
		}

		runner();
	}, [professions]);
}
