import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { SheetManager } from 'react-native-actions-sheet';

import { Button, Text } from '@touchblack/ui';

import { SheetType } from 'sheets';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import server from '@utils/axios';
import CONSTANTS from '@constants/constants';
import { useNavigation } from '@react-navigation/native';

export default function UnarchiveTalentSheet({ item }: { item: string }) {
	const { styles } = useStyles(stylesheet);
	const unarchiveMutation = useMutation({
		mutationFn: (blackbook_id: string) => server.post(CONSTANTS.endpoints.unarchive_blackbook(blackbook_id)),
	});
	const queryClient = useQueryClient();
	const navigation = useNavigation();

	function handleUnarchiveTalentPress() {
		unarchiveMutation.mutate(item, {
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['useGetBlackBookProfessions'] });
				queryClient.invalidateQueries({ queryKey: ['talentDetailsById'] });
				queryClient.invalidateQueries({ queryKey: ['useGetBlackBookTalentsByProfession'] });
				queryClient.invalidateQueries({ queryKey: ['useGetArchivedBlackBookList'] });
				queryClient.invalidateQueries({ queryKey: ['useGetTrendingTalents'] });
				queryClient.invalidateQueries({ queryKey: ['useGetFilmsOfTalentAsCrew'] });
				queryClient.invalidateQueries({ queryKey: ['useGetWorkedWith'] });
				queryClient.invalidateQueries({ queryKey: ['useGetCrewList'] });
				queryClient.invalidateQueries({ queryKey: ['useGetSearchedBlackBookByOwnerId'] });
				navigation.goBack()
				SheetManager.hide('Drawer', {
					payload: { sheet: SheetType.UnarchiveTalent },
				});
			},
		});
	}

	return (
		<View>
			<View style={styles.contentContainer}>
				<Text size="primaryMid" color="regular" style={styles.regularFontFamily}>
					Unarchive Talent
				</Text>
				<Text size="primarySm" color="regular" style={styles.description}>
					Are you sure want to unarchive the talent?
				</Text>
			</View>
			<View style={styles.buttonContainer}>
				<Button
					textColor="regular"
					type="secondary"
					style={styles.buttonCancel}
					onPress={() =>
						SheetManager.hide('Drawer', {
							payload: { sheet: SheetType.UnarchiveTalent },
						})
					}>
					Cancel
				</Button>
				<Button style={styles.buttonSubmit} onPress={handleUnarchiveTalentPress}>
					Confirm
				</Button>
			</View>
		</View>
	);
}

const stylesheet = createStyleSheet(theme => ({
	baseGap: {
		gap: theme.gap.xxs,
	},
	contentContainer: {
		margin: theme.margins.lg,
		gap: theme.gap.base,
	},
	formLabel: {
		fontSize: theme.fontSize.button,
	},
	textInput: {
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		color: theme.colors.typography,
		backgroundColor: theme.colors.backgroundDarkBlack,
		textAlignVertical: 'top',
		height: 80,
	},
	regularFontFamily: {
		fontFamily: 'CabinetGrotesk-Regular',
		alignSelf: 'center',
	},
	description: {
		opacity: 0.5,
		alignSelf: 'center',
		width: '100%',
		textAlign: 'center',
	},
	buttonCancel: {
		flexGrow: 1,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	buttonSubmit: {
		flexGrow: 1,
	},
	buttonContainer: {
		flexDirection: 'row',
		borderTopWidth: theme.borderWidth.slim,
		borderTopColor: theme.colors.muted,
		padding: theme.padding.lg,
	},
}));
