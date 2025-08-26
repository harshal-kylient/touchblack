import { Text } from '@touchblack/ui';
import React from 'react';
import { View, Image, Pressable } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import createAbsoluteImageUri from '@utils/createAbsoluteImageUri';
import capitalized from '@utils/capitalized';
import { StudioUser } from '@touchblack/icons';
import server from '@utils/axios';
import CONSTANTS from '@constants/constants';
import { useAuth } from '@presenters/auth/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { useStudioBookingContext } from './StudioContext';

interface StudioCardProps {
	pressEnabled: boolean;
	project_id: UniqueId;
	item: object;
	cta?: any;
}

const StudioCardView: React.FC<StudioCardProps> = ({ pressEnabled = true, project_id, item, cta }) => {
	const { styles, theme } = useStyles(stylesheet2);
	const { producerId } = useAuth();
	const { state, dispatch } = useStudioBookingContext();
	const navigation = useNavigation();
	async function handleStudioPress() {
		if (!pressEnabled) return;
		// make a network call to get conversation id and navigate there
		const response = await server.get(CONSTANTS.endpoints.fetch_conversation_id(item?.id, producerId!, project_id, 'producer_studio_floor'));
		navigation.navigate('StudioConversation', { id: response.data?.data?.conversation_id, project_id });
	}

	return (
		<Pressable onPress={handleStudioPress} style={{ backgroundColor: theme.colors.backgroundDarkBlack, borderTopWidth: theme.borderWidth.slim, borderBottomWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
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
						{cta ? cta : null}
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
		fontSize: 12,
		color: 'rgba(233, 191, 153, 1)',
	},
	priceValue: {
		fontFamily: 'Figtree, sans-serif',
		fontSize: 20,
		color: '#FFF',
		fontWeight: '700',
		marginTop: 4,
	},
}));

export default StudioCardView;
