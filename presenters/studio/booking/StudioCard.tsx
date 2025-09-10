import CheckBox from '@components/Checkbox';
import { Text } from '@touchblack/ui';
import React from 'react';
import { View, Image, Pressable } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useStudioBookingContext } from './StudioContext';
import createAbsoluteImageUri from '@utils/createAbsoluteImageUri';
import capitalized from '@utils/capitalized';
import { useNavigation } from '@react-navigation/native';
import { StudioUser } from '@touchblack/icons';

interface StudioCardProps {
	id: UniqueId;
	item: object;
}

const StudioCard: React.FC<StudioCardProps> = ({ id, item }) => {
	const { styles, theme } = useStyles(stylesheet2);
	const { state, dispatch } = useStudioBookingContext();
	const navigation = useNavigation();

	function handleSelectItem() {
		if (state?.studio_floor?.findIndex(it => it?.id === item?.id) !== -1) {
			dispatch({ type: 'REMOVE_STUDIO_FLOOR', value: item });
			return;
		}
		dispatch({ type: 'ADD_STUDIO_FLOOR', value: item });
	}

	function handleCardPress() {
		navigation.navigate('StudioDetails', { id, studio: item, shortlist: true });
	}

	return (
		<Pressable onPress={handleCardPress} style={{ borderBottomWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
			<View style={styles.container}>
				<View style={styles.header}>
					{item?.profile_picture_url ? (
						<Image resizeMode="cover" source={{ uri: createAbsoluteImageUri(item?.profile_picture_url) }} style={styles.studioImage} />
					) : (
						<View style={{ justifyContent: 'center', borderRightWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, alignItems: 'center', minWidth: 70, minHeight: 70 }}>
							<StudioUser size="44" color={theme.colors.muted} />
						</View>
					)}
					<View style={styles.studioInfo}>
						<View>
							<Text size="button" color="regular" style={styles.studioName}>
								{capitalized(item?.name)}
							</Text>
							<Text size="button" color="regular" style={styles.studioLocation}>
								{item?.city}, {item?.locality}
							</Text>
						</View>
						<CheckBox onChange={handleSelectItem} value={state.studio_floor?.findIndex(it => it?.id === id) !== -1} />
					</View>
				</View>
				<View style={styles.pricing}>
					<View style={{ flexDirection: 'row', gap: theme.gap.xxs, alignItems: 'center' }}>
						<Text size="button" color="regular" style={styles.priceLabel}>
							Shift
						</Text>
						<Text size="bodyMid" color="regular">
							{item?.shift_duration}Hr
						</Text>
					</View>
					<View style={{ flexDirection: 'row', gap: theme.gap.xxs, alignItems: 'center' }}>
						<Text size="button" color="regular" style={styles.priceLabel}>
							Rate/Shift
						</Text>
						<Text size="button" color="regular" style={styles.priceValue}>
							₹ {item?.studio_charges_per_shift?.[state.project_id?.video_type?.id]}
						</Text>
					</View>
				</View>
			</View>
		</Pressable>
	);
};

const stylesheet2 = createStyleSheet(theme => ({
	container: {
		borderColor: theme.colors.muted,
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		marginHorizontal: theme.margins.base,
	},
	header: {
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderBottomColor: '#555',
	},
	studioImage: {
		width: 70,
		height: 70,
		borderRightWidth: 1,
		borderRightColor: '#555',
	},
	studioInfo: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 16,
	},
	studioName: {
		fontFamily: 'Cabinet Grotesk, sans-serif',
		fontSize: 16,
		color: '#FFF',
		fontWeight: '700',
	},
	studioLocation: {
		fontFamily: 'Figtree, sans-serif',
		fontSize: 12,
		color: '#FFF',
		marginTop: 4,
	},
	infoIcon: {
		width: 24,
		height: 24,
	},
	pricing: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 16,
	},
	priceItem: {
		alignItems: 'center',
	},
	priceLabel: {
		fontFamily: 'Figtree, sans-serif',
		fontWeight: 'bold',
		fontSize: 12,
		color: 'rgba(233, 191, 153, 1)',
	},
	priceValue: {
		fontFamily: 'Figtree, sans-serif',
		fontSize: 16,
		color: '#FFF',
		fontWeight: '700',
	},
}));

export default StudioCard;
