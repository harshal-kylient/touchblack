import { useEffect } from 'react';
import { useProjectsContext } from '../ProjectContext';
import useGetProjectDetails from '@network/useGetProjectDetails';

export default function useInitializerStep1(reset: any) {
	const { state, dispatch } = useProjectsContext();

	const { data: projectDetails } = useGetProjectDetails(state.project_details.project_id!);

	useEffect(() => {
		const value = {
			brand_id: projectDetails?.brand
				? {
						id: projectDetails?.brand?.id,
						name: projectDetails?.brand?.name,
				  }
				: null,
			project_id: state.project_details.project_id!,
			film_brief: projectDetails?.film_brief,
			film_brief_attachment: projectDetails?.film_brief_attachment_url
				? {
						uri: null,
						type: decodeURIComponent(projectDetails?.film_brief_attachment_url?.split('.').pop()),
						name: decodeURIComponent(projectDetails?.film_brief_attachment_url?.split('/').pop()),
				  }
				: null,
			location_ids: projectDetails?.location?.map(it => ({ id: it?.id, name: it?.name })),
			project_name: projectDetails?.project_name,
			video_type_id: { id: projectDetails?.video_type?.id, name: projectDetails?.video_type?.name },
		};

		dispatch({ type: 'PROJECT_DETAILS_DEFAULT', value });
		dispatch({ type: 'PROJECT_DETAILS', value });

		reset(value);
	}, [projectDetails]);
}
