import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SheetManager } from 'react-native-actions-sheet';

import { useNavigation } from '@react-navigation/native';

import server from '@utils/axios';
import CONSTANTS from '@constants/constants';
import { SheetType } from 'sheets';

interface UnlikeFilmVariables {
	blackbook_id: UniqueId;
	film_ids: UniqueId[];
	film_name: string;
}

export function useUnlikeBlackBookFilms() {
	const queryClient = useQueryClient();
	const navigation = useNavigation();

	return useMutation({
		mutationFn: async ({ blackbook_id, film_ids }: { blackbook_id: UniqueId; film_ids: UniqueId[] }) => {
			const response = await server.post(CONSTANTS.endpoints.remove_blackbook_film_by_bookmark_id, {
				blackbook_id: blackbook_id,
				film_ids: film_ids,
			});
			return response.data;
		},
		onSuccess: (data, variables: UnlikeFilmVariables) => {
			const { film_name } = variables;

			SheetManager.show('Drawer', {
				payload: {
					sheet: SheetType.Success,
					data: {
						header: 'Unliked film',
						text: `${film_name} is successfully removed from liked films.`,
						onPress: () => {
							queryClient.refetchQueries({ queryKey: ['useGetBlackBookTalentsByProfession'] });
							queryClient.invalidateQueries({ queryKey: ['useGetBookmarkedFilms'] });
							// navigation.navigate('Blackbook');
						},
					},
				},
			});
		},
	});
}
