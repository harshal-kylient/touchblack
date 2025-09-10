import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { SheetManager } from 'react-native-actions-sheet';
import { Delete } from '@touchblack/icons';
import { Button, Text } from '@touchblack/ui';
import CONSTANTS from '@constants/constants';
import { SheetType } from 'sheets';
import { useDeleteGSTDetail } from '@network/useGSTList';

export default function DeleteGST({ gst_id, role }: { gst_id: string; role: string }) {
	const { styles, theme } = useStyles(stylesheet);
	const deleteGSTDetail = useDeleteGSTDetail(role);

	async function onSubmit() {
		try {
			await deleteGSTDetail.mutateAsync(gst_id);
			SheetManager.show('Drawer', {
				payload: {
					sheet: SheetType.Success,
					data: {
						header: 'Deleted',
						text: 'The GST is successfully deleted.',
					},
				},
			});
		} catch (error) {}
	}

	return (
		<View style={styles.container}>
			<View style={styles.contentContainer}>
				<View style={styles.iconContainer}>
					<View style={styles.icon}>
						<Delete color={theme.colors.success} size={`${CONSTANTS.screenWidth / 4}`} />
					</View>
				</View>
				<Text size="primaryMid" color="regular" style={styles.regularFontFamily}>
					Delete GST!
				</Text>
				<Text size="bodyBig" color="muted" style={[styles.regularFontFamily, { paddingHorizontal: theme.margins.xs }]}>
					Are you sure you want to delete this GST? This action cannot be undone.
				</Text>
			</View>
			<View style={styles.buttonContainer}>
				<Button
					textColor="regular"
					type="secondary"
					style={styles.buttonCancel}
					onPress={() =>
						SheetManager.hide('Drawer', {
							payload: { sheet: SheetType.DeleteGST },
						})
					}>
					Cancel
				</Button>
				<Button style={styles.buttonSubmit} onPress={onSubmit}>
					Confirm
				</Button>
			</View>
		</View>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	contentContainer: {
		gap: theme.gap.base,
		marginBottom: theme.margins.base,
	},
	iconContainer: {
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		justifyContent: 'center',
		alignItems: 'center',
	},
	errorText: (serverError: any) => ({
		width: '100%',
		color: theme.colors.destructive,
		padding: 10,
		textAlign: 'center',
		fontSize: theme.fontSize.typographyMd,
		fontFamily: 'CabinetGrotesk-Regular',
		display: serverError ? 'flex' : 'none',
		borderTopWidth: theme.borderWidth.slim,
		borderTopColor: theme.colors.destructive,
	}),
	icon: {
		width: CONSTANTS.screenWidth / 3,
		height: CONSTANTS.screenWidth / 3,
		justifyContent: 'center',
		alignItems: 'center',
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	regularFontFamily: {
		fontFamily: 'CabinetGrotesk-Regular',
		marginHorizontal: theme.margins.xs,
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
