import { useMutation, useQueryClient } from '@tanstack/react-query';
import CONSTANTS from '@constants/constants';
import { IStudioFloor } from '@models/entities/IStudioFloor';
import server from '@utils/axios';

const updateStudioFloorProfilePicture = async (payload: IStudioFloor) => {
	const url = CONSTANTS.endpoints.studio_floor_update_profile_picture(payload.id);
	const formData = new FormData();
	formData.append('profile_picture', {
		uri: payload.profile_picture.uri,
		type: payload.profile_picture.type,
		name: payload.profile_picture.name,
	});
	const response = await server.post(url, formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});
	if (response.status !== 200) {
		throw new Error('Failed to update studio floor profile picture');
	}
	return response.data;
};

export const useUpdateStudioFloorProfilePicture = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateStudioFloorProfilePicture,
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: ['studio_floor_details', variables.id] });
		},
	});
};
