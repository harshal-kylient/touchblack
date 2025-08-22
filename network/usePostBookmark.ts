import CONSTANTS from '@constants/constants';
import IBookmarkDto from '@models/dtos/IBookmarkDto';
import useSWR from 'swr';

export default function usePostBookmark(payload: IBookmarkDto) {
	return useSWR([payload && CONSTANTS.endpoints.update_profile, { method: 'POST' }]);
}
