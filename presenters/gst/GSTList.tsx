import { memo, useMemo } from 'react';
import { Pressable, SafeAreaView, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Delete, Radio, RadioFilled } from '@touchblack/icons';
import { Button, Slideable, Text } from '@touchblack/ui';
import { FlashList } from '@shopify/flash-list';
import { useNavigation } from '@react-navigation/native';
import Header from '@components/Header';
import NoGstFound from '@components/errors/NoGstFound';
import TextWithIconPlaceholder from '@components/loaders/TextWithIconPlaceholder';
import useGSTList, { GSTDetail } from '@network/useGSTList';
import useGSTListLogic from './useGSTListLogic';
import CONSTANTS from '@constants/constants';
import { useAuth } from '@presenters/auth/AuthContext';

export default function GSTList({ route }) {
	const role = route.params?.role;
	const navigation = useNavigation();
	const { styles, theme } = useStyles(stylesheet);
	const { loginType, managerTalentId } = useAuth();
	const talentId = loginType === 'manager' ? managerTalentId : '';
	const { data: gstList, isLoading } = useGSTList(role, talentId);
	const { handleDeleteGST, handleAddGST, handleUpdateGST, handleSelectGST, selectedGSTIN } = useGSTListLogic(role);
	const isManager = loginType === 'manager' && role !== 'managerTalent';
	const isManagerTalent = loginType === 'manager' && role === 'managerTalent';
	const isGeneric = loginType === 'talent' || loginType === 'producer';
	const gstCount = gstList?.data?.length || 0;
	const canShowAddButton = (isManager && gstCount < 1) || isManagerTalent || isGeneric;

	const DeleteButton = useMemo(
		() => (
			<View style={styles.buttonElement}>
				<Delete size="24" strokeColor={theme.colors.black} color={theme.colors.black} />
				<Text size="cardSubHeading" color="black">
					Delete
				</Text>
			</View>
		),
		[theme, styles],
	);

	const handleDetails = id => {
		navigation.navigate('GSTInDetails', {
			role: role === 'managerTalent' ? 'managerTalent' : undefined,
			id: id,
		});
	};

	const GSTListItem = memo(({ item }: { item: GSTDetail }) => {
		const isSelected = selectedGSTIN === item.id;

		return (
			<Slideable onButtonPress={() => handleDeleteGST(item.id)} buttonElement={DeleteButton}>
				<View style={styles.marginContainer}>
					<View style={styles.itemContainer}>
						<Pressable onPress={() => handleDetails(item.id)}>
							<View style={styles.textContainer}>
								<Text size="bodyMid" color="muted" style={styles.lineHeight} numberOfLines={1}>
									{item.legal_name}
								</Text>
								<Text size="secondary" color="regular" style={styles.lineHeight} weight="bold" numberOfLines={1}>
									{item.gstin}
								</Text>
							</View>
						</Pressable>

						<Pressable onPress={() => handleSelectGST(item.id)}>
							<View style={styles.radioButtonContainer}>{isSelected ? <RadioFilled color={theme.colors.primary} size={'24'} /> : <Radio id="gst_applicable" size={'24'} color={theme.colors.borderGray} />}</View>
						</Pressable>
					</View>
				</View>
			</Slideable>
		);
	});

	if (isLoading) {
		return (
			<View style={styles.container}>
				<TextWithIconPlaceholder />
				<TextWithIconPlaceholder />
				<TextWithIconPlaceholder />
			</View>
		);
	}
	return (
		<SafeAreaView style={styles.container}>
			<Header name="GSTIN" />
			<FlashList
				data={gstList?.data}
				renderItem={({ item }) => <GSTListItem item={item} />}
				estimatedItemSize={100}
				extraData={selectedGSTIN}
				ListEmptyComponent={
					<View style={{ flex: 1, height: (7.5 * CONSTANTS.screenHeight) / 10, justifyContent: 'center' }}>
						<NoGstFound />
					</View>
				}
			/>
			<View style={styles.footer}>
				<Button type="secondary" textColor={!selectedGSTIN ? 'muted' : 'regular'} onPress={handleUpdateGST} style={!selectedGSTIN ? styles.disabledButton : styles.secondaryButton} isDisabled={!selectedGSTIN}>
					Edit
				</Button>
				{canShowAddButton && (
					<Button type="primary" onPress={handleAddGST} style={styles.button}>
						Add
					</Button>
				)}
			</View>
		</SafeAreaView>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
	textContainer: {
		flex: 1,
		paddingVertical: theme.padding.base,
		gap: theme.gap.steps,
	},
	marginContainer: {
		paddingHorizontal: theme.margins.base,
		backgroundColor: theme.colors.backgroundDarkBlack,
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	itemContainer: {
		flexDirection: 'row',
		flex: 1,
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		alignItems: 'center',
		paddingHorizontal: theme.padding.base,
		gap: theme.gap.xxs,
		backgroundColor: theme.colors.backgroundDarkBlack,
		justifyContent: 'space-between',
	},
	radioButtonContainer: {
		paddingLeft: theme.padding.base,
	},
	lineHeight: {
		lineHeight: theme.lineHeight.lg,
	},
	buttonElement: {
		backgroundColor: theme.colors.destructive,
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: '100%',
		paddingHorizontal: theme.padding.base,
	},
	footer: {
		display: 'flex',
		borderTopWidth: theme.borderWidth.slim,
		backgroundColor: theme.colors.backgroundLightBlack,
		borderColor: theme.colors.borderGray,
		padding: theme.padding.base,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	button: {
		flex: 1,
	},
	secondaryButton: {
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		flex: 1,
	},
	disabledButton: {
		opacity: 0.3,
		flex: 1,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
}));
