import { useMutation, useQueryClient } from '@tanstack/react-query';
import server from '@utils/axios';
import CONSTANTS from '@constants/constants';
import { SheetManager } from 'react-native-actions-sheet';
import { SheetType } from 'sheets';

const useArchiveBlackBook = () => {
	const queryClient = useQueryClient();

	const archiveMutation = useMutation({
		mutationFn: (blackbook_id: string) => server.post(CONSTANTS.endpoints.archive_blackbook(blackbook_id)),
	});

	const handleArchive = (blackbook_id: string) => {
		archiveMutation.mutate(blackbook_id, {
			onSuccess: () => {
				SheetManager.show('Drawer', {
					payload: {
						sheet: SheetType.Success,
						data: {
							header: 'Your favorites profile archived',
							text: 'Your favorites is successfully archived.',
							onPress: () => {
								queryClient.invalidateQueries({ queryKey: ['useGetBlackBookProfessions'] });
								queryClient.invalidateQueries({ queryKey: ['useGetArchivedBlackBookList'] });
								queryClient.invalidateQueries({ queryKey: ['useGetSearchedBlackBookByOwnerId'] });
							},
						},
					},
				});
			},
		});
	};

	return { handleArchive, archiveMutation };
};

export default useArchiveBlackBook;
