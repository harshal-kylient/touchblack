import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { SheetManager } from 'react-native-actions-sheet';

import { Button, Text } from '@touchblack/ui';

import { SheetType } from 'sheets';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import server from '@utils/axios';
import CONSTANTS from '@constants/constants';
import { useNavigation } from '@react-navigation/native';

export default function RemoveMyFavorites({ item }: { item: string }) {
	const { styles } = useStyles(stylesheet);
	const queryClient = useQueryClient();
	const navigation = useNavigation();
	const removeMutation = useMutation({
		mutationFn: (id: string) => server.delete(CONSTANTS.endpoints.remove_from_favorites, { data: { id } }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['useGetSearchedBlackBookByOwnerId'] });
			queryClient.invalidateQueries({ queryKey: ['useGetArchivedBlackBookList'] });
			;
			SheetManager.hide('Drawer', {
				payload: { sheet: SheetType.RemoveMyFavorites },
			});
		},
		onError: error => {
			console.error('Failed to remove favorite:', error);
		},
	});
	const handleRemoveTalentPress = (id: string) => {
		removeMutation.mutate(id);
	};

	return (
		<View>
			<View style={styles.contentContainer}>
				<Text size="primaryMid" color="regular" style={styles.regularFontFamily}>
					Remove Talent
				</Text>
				<Text size="primarySm" color="regular" style={styles.description}>
					Are you sure you want to remove this user from your Favourites? You will stop seeing their content with priority.
				</Text>
			</View>
			<View style={styles.buttonContainer}>
				<Button
					textColor="regular"
					type="secondary"
					style={styles.buttonCancel}
					onPress={() =>
						SheetManager.hide('Drawer', {
							payload: { sheet: SheetType.RemoveMyFavorites },
						})
					}>
					Cancel
				</Button>
				<Button style={styles.buttonSubmit} onPress={() => handleRemoveTalentPress(item)}>
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
