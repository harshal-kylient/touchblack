import CONSTANTS from '@constants/constants';
import IUpdateProfileDto from '@models/dtos/IUpdateProfileDto';
import useSWR from 'swr';

export default function usePostUpdateProfile(payload: IUpdateProfileDto) {
	return useSWR([payload && CONSTANTS.endpoints.update_profile, { method: 'POST' }]);
}
