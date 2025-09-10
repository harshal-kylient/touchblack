import React, { useCallback } from 'react';
import { View, Image, Pressable } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@touchblack/ui';
import { Pencil, Person } from '@touchblack/icons';

import { formatAmount } from '@utils/formatCurrency';
import { IStudioFloor } from '@models/entities/IStudioFloor';
import { useUpdateStudioFloorProfilePicture } from '@network/useUpdateStudioFloorProfilePicture';
import createAbsoluteImageUri from '@utils/createAbsoluteImageUri';
import { useAuth } from '@presenters/auth/AuthContext';
import { SheetManager } from 'react-native-actions-sheet';
import { SheetType } from 'sheets';

interface StudioProfileProps {
	floorDetails: IStudioFloor;
}

export const StudioProfileCard: React.FC<StudioProfileProps> = ({ floorDetails }) => {
	const { styles, theme } = useStyles(stylesheet);
	const { loginType } = useAuth();
	const { mutate: updateStudioFloorProfilePicture } = useUpdateStudioFloorProfilePicture();

	const handleEditImage = useCallback(() => {
		SheetManager.show('Drawer', {
			payload: {
				sheet: SheetType.StudioRequest,
				data: {
					header: 'Edit Request',
					text: 'If you wish to edit the information, please contact Talent Grid.',
					onPress: () => {
						SheetManager.hide('Drawer', {
							payload: {
								sheet: SheetType.StudioRequest,
							},
						});
					},
				},
			},
		});
	}, []);

	return (
		<View style={styles.profileContainer}>
			<View style={styles.borderHorizontalContainer}>
				{loginType === 'studio' && (
					<Pressable onPress={handleEditImage} style={styles.editImageButton}>
						<Pencil size="24" strokeWidth={3} strokeColor={theme.colors.typography} />
					</Pressable>
				)}
				{floorDetails?.cover_photo_url ? (
					<Image source={{ uri: createAbsoluteImageUri(floorDetails?.cover_photo_url || '') }} style={styles.image} accessibilityLabel="Studio image" />
				) : (
					<View style={styles.image}>
						<Person size="240" color={theme.colors.muted} />
					</View>
				)}
				<View style={styles.row}>
					<View style={styles.titleContainer}>
						<Text size="bodyBig" color="regular" weight="bold" style={styles.titleText}>
							{floorDetails.city}
						</Text>
						<Text size="bodySm" color="regular" style={styles.subtitleText}>
							{floorDetails.locality}
						</Text>
					</View>
				</View>
			</View>
		</View>
	);
};

const stylesheet = createStyleSheet(theme => ({
	profileContainer: {
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		borderBottomWidth: theme.borderWidth.bold,
		paddingHorizontal: theme.margins.base,
		backgroundColor: theme.colors.backgroundDarkBlack,
		position: 'relative',
	},
	borderHorizontalContainer: {
		borderLeftWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		borderRightWidth: theme.borderWidth.slim,
	},
	editImageButton: {
		width: 44,
		height: 44,
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
		top: 0,
		right: 0,
		backgroundColor: '#00000040',
		zIndex: 100,
	},
	image: {
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		aspectRatio: 1,
		backgroundColor: theme.colors.black,
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: theme.padding.base,
		paddingVertical: theme.padding.xs,
		width: '100%',
		position: 'absolute',
		bottom: 0,
		backgroundColor: '#00000080',
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		minHeight: 60,
	},
	titleContainer: {
		gap: theme.gap.xxxs,
	},
	titleText: {
		lineHeight: 22,
	},
	subtitleText: {
		lineHeight: 14,
	},
	pricingContainer: {
		gap: theme.gap.xxxs,
	},
	pricingText: {
		lineHeight: 24,
	},
}));
