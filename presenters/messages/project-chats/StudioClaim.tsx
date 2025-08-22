import { memo, useCallback, useState } from 'react';
import { Linking, Pressable, TouchableOpacity, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { SheetManager } from 'react-native-actions-sheet';
import { Button, Text } from '@touchblack/ui';
import { FieldItem } from './FieldItem';
import { SheetType } from 'sheets';
import { formatAmount } from '@utils/formatCurrency';
import server from '@utils/axios';
import CONSTANTS from '@constants/constants';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@presenters/auth/AuthContext';
import { ArrowDown, Download } from '@touchblack/icons';
import useSentByMe from './useSentByMe';
import { useStudioConversationContext } from './useStudioConversationContext';
import createAbsoluteImageUri from '@utils/createAbsoluteImageUri';
import { useNavigation } from '@react-navigation/native';

interface IProps {
	onCounter?: () => void;
	onConfirm?: () => void;
	item: any;
	enabled: boolean;
	sender_name: string;
	conversation_id: UniqueId;
}

const StudioClaim = memo(({ onCounter, onConfirm, item, enabled, conversation_id, sender_name }: IProps) => {
	const { styles, theme } = useStyles(stylesheet);
	const { permissions, loginType } = useAuth();
	const queryClient = useQueryClient();
	const [isOpen, setIsOpen] = useState(false);
	const sentByMe = useSentByMe(item);
	const extraData = item?.content?.negotiation?.extra_data ? JSON.parse(item.content.negotiation.extra_data) : {};
	const { setup_days, shoot_days, dismantle_days, total_days } = useStudioConversationContext();
	const navigation = useNavigation();

	const handleCounter = () => {
		if (onCounter) {
			onCounter();
		}
		loginType === 'producer' ? handleProducerCounter() : handleStudioCounter();
	};

	const handleStudioCounter = () => {
		navigation.navigate('StudioCounterNegotiation', {
			sender_name,
			conversation_id,
			days: item?.content?.total_days || total_days,
			setup_days: item?.content?.setup_days || setup_days,
			shoot_days: item?.content?.shoot_days || shoot_days,
			dismantle_days: item?.content?.dismantle_days || dismantle_days,
			hours: item?.content?.number_of_hours,
			negotiation_id: item?.content?.negotiation?.id,
			comments: item?.content?.negotiation?.comments,
			cancellation_charges: item?.content?.negotiation?.cancellation_charges,
			payment_terms: item?.content?.negotiation?.payment_terms,
			gst_applicable: item?.content?.gst_applicable,
			amount: item?.content?.negotiation?.amount,
			advance_amount: item?.content?.negotiation?.advance_amount,
			full_advance: item?.content?.negotiation?.full_advance,
			...extraData,
		});
	};

	const handleProducerCounter = useCallback(() => {
		SheetManager.show('Drawer', {
			payload: {
				sheet: SheetType.StudioCounterOffer,
				data: {
					sender_name,
					conversation_id,
					days: item?.content?.number_of_days,
					hours: item?.content?.number_of_hours,
					negotiation_id: item?.content?.negotiation?.id,
					comments: item?.content?.negotiation?.comments,
					cancellation_charges: item?.content?.negotiation?.cancellation_charges,
					payment_terms: item?.content?.negotiation?.payment_terms,
					gst_applicable: item?.content?.negotiation?.gst_applicable,
					amount: item?.content?.negotiation?.amount,
					advance_amount: item?.content?.negotiation?.advance_amount,
					...extraData,
				},
			},
		});
	}, [onCounter, sender_name, conversation_id, item?.content?.negotiation]);

	const handleConfirm = useCallback(async () => {
		if (onConfirm) {
			onConfirm();
		}
		try {
			const response = await server.post(CONSTANTS.endpoints.confirm_offer(item?.content?.negotiation?.id));
			if (response.data?.success) {
				SheetManager.show('Drawer', {
					payload: {
						sheet: SheetType.Success,
						data: {
							header: 'Confirmed!',
							text: response.data?.message,
							onPress: async () => await queryClient.invalidateQueries(['useGetAllMessages', conversation_id]),
						},
					},
				});
			}
		} catch (error) {}
	}, [onConfirm, item?.content?.negotiation?.id]);

	const isConfirmedOrDisabled = !(loginType === 'studio' || loginType === 'producer' ? permissions?.includes('Messages::Edit') && enabled : enabled);

	return (
		<>
			<View style={styles.header(sentByMe)}>
				<Text size="cardHeading" color="muted">
					{sender_name} Revised
				</Text>
				<Text size="cardHeading" weight="bold" color="regular">
					{formatAmount(item?.content?.negotiation?.amount)}/-
				</Text>
			</View>
			<View style={styles.body}>
				<FieldItem orientation="row" label="Advance Amount:" style={styles.field} value={`${formatAmount(item?.content?.negotiation?.advance_amount)}`} />
				{item?.content?.negotiation?.payment_terms ? <FieldItem orientation="row" label="Payment Terms:" style={styles.field} value={item?.content?.negotiation?.payment_terms ? `${item?.content?.negotiation?.payment_terms} Days` : '-'} /> : null}
			</View>
			{item?.sender_type === 'studio' && (
				<View style={styles.pricingListView}>
					<TouchableOpacity onPress={() => setIsOpen(!isOpen)} style={styles.pricingListButtonView}>
						<View style={styles.pricingListTextView}>
							<Text size="cardHeading" color="regular">
								Pricing List
							</Text>
							<ArrowDown
								size="22"
								color={theme.colors.typography}
								style={{
									transform: [{ rotate: isOpen ? '180deg' : '0deg' }],
								}}
							/>
						</View>
					</TouchableOpacity>
				</View>
			)}

			{isOpen && item?.sender_type === 'studio' && (
				<>
					<View style={{ borderColor: theme.colors.borderGray }}>
						<View style={styles.tableContainer(sentByMe)}>
							<View style={{ flexDirection: 'row' }}>
								<View style={styles.tableHeadingColumn2}>
									<Text color="primary" size="bodySm" textAlign="center">
										Service
									</Text>
								</View>
								<View style={styles.tableHeadingColumn2}>
									<Text color="primary" size="bodySm" textAlign="center">
										Setup
									</Text>
								</View>
								<View style={styles.tableHeadingColumn2}>
									<Text color="primary" size="bodySm" textAlign="center">
										Shoot
									</Text>
								</View>
								<View style={styles.tableHeadingColumn2}>
									<Text color="primary" size="bodySm" textAlign="center">
										Dismantle
									</Text>
								</View>
							</View>
							<View style={{ flexDirection: 'row' }}>
								<View style={styles.tableHeadingColumn2}>
									<Text color="regular" size="bodySm" textAlign="center">
										No. of Days
									</Text>
								</View>
								<View style={styles.tableContentColumn2}>
									<Text color="regular" size="bodySm" textAlign="center">
										{setup_days}
									</Text>
								</View>
								<View style={styles.tableContentColumn2}>
									<Text color="regular" size="bodySm" textAlign="right">
										{shoot_days}
									</Text>
								</View>
								<View style={styles.tableContentColumn2}>
									<Text color="regular" size="bodySm" textAlign="right">
										{dismantle_days}
									</Text>
								</View>
							</View>
						</View>
					</View>
					<View style={styles.header(sentByMe)}>
						<Text color="regular" size="bodyMid">
							Shoot day price List
						</Text>
					</View>
					<View style={styles.pricingListContainer}>
						<View style={styles.tableContainer(sentByMe)}>
							<View style={{ flexDirection: 'row' }}>
								<View style={styles.tableHeadingColumn1(loginType === 'studio' ? 3 : 2)}>
									<Text color="primary" size="bodySm" textAlign="center">
										Service
									</Text>
								</View>
								{loginType === 'studio' && (
									<View style={styles.tableHeadingColumn1(loginType === 'studio' ? 3 : 2)}>
										<Text color="primary" size="bodySm" textAlign="center">
											Amt/Shift
										</Text>
									</View>
								)}
								<View style={styles.tableHeadingColumn1(loginType === 'studio' ? 3 : 2)}>
									<Text color="primary" size="bodySm" textAlign="center">
										Total
									</Text>
								</View>
							</View>
							{Object.entries(extraData?.services)?.map(([name, price]) => (
								<View style={{ flexDirection: 'row' }}>
									<View style={styles.tableHeadingColumn1(loginType === 'studio' ? 3 : 2)}>
										<Text color="regular" size="bodySm" textAlign="center">
											{name}
										</Text>
									</View>
									{loginType === 'studio' && (
										<View style={styles.tableContentColumn(loginType === 'studio' ? 3 : 2)}>
											<Text color="regular" size="bodySm" textAlign="center">
												{price.price_shift}
											</Text>
										</View>
									)}
									<View style={styles.tableContentColumn(loginType === 'studio' ? 3 : 2)}>
										<Text color="regular" size="bodySm" textAlign="center">
											{price.total}
										</Text>
									</View>
								</View>
							))}
							<View style={{ flexDirection: 'row' }}>
								<View style={{ minWidth: `${100 / (loginType === 'studio' ? 3 : 2)}%`, maxWidth: `${100 / (loginType === 'studio' ? 3 : 2)}%`, justifyContent: 'center', alignItems: 'center', borderRightWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
									<Text color="regular" size="primarySm">
										Total
									</Text>
								</View>
								<View style={styles.totalAmountView(loginType === 'studio' ? 3 : 2)}>
									<Text color="regular" size="primarySm" style={styles.totalAmountText} textAlign="right">
										{Object.values(extraData?.services)?.reduce((acc, curr) => acc + Number(curr?.total), 0)}
									</Text>
								</View>
							</View>
						</View>
					</View>
				</>
			)}

			{item?.sender_type === 'studio' && Boolean(extraData?.terms_and_conditions_url) && (
				<View style={styles.termsAndConditionsContainer}>
					<Text color="regular" size="bodyMid">
						Terms & Conditions
					</Text>
					<Pressable style={{}} onPress={() => Linking.openURL(createAbsoluteImageUri(extraData?.terms_and_conditions_url))}>
						<Download size="24" />
					</Pressable>
				</View>
			)}
			{item?.content?.negotiation?.comments ? <FieldItem orientation="row" label={`Note: ${item?.content?.negotiation?.comments}`} style={styles.field} value={''} /> : null}
			{!sentByMe && (
				<View style={styles.footer}>
					<Button isDisabled={isConfirmedOrDisabled} type="secondary" textColor="regular" onPress={handleCounter} style={styles.button(isConfirmedOrDisabled)}>
						Counter
					</Button>
					<Button isDisabled={isConfirmedOrDisabled} type="primary" onPress={handleConfirm} style={styles.button(isConfirmedOrDisabled)}>
						Accept
					</Button>
				</View>
			)}
			<View style={{ borderTopWidth: theme.borderWidth.slim, borderColor: '#fff4' }}>
				<Text style={{ color: theme.colors.success, fontWeight: 'bold', paddingVertical: theme.padding.xxs, paddingHorizontal: theme.padding.base }} textAlign={sentByMe ? 'right' : 'left'} size="bodyMid">
					{item?.content?.sender_name}
				</Text>
			</View>
		</>
	);
});

const stylesheet = createStyleSheet(theme => ({
	header: (sentByMe: boolean) => ({
		minWidth: '100%',
		gap: theme.gap.sm,
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: sentByMe ? '#28251E' : theme.colors.black,
		padding: theme.padding.xs,
		alignItems: 'center',
	}),
	pricingListView: {
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		paddingHorizontal: theme.padding.sm,
		width: '100%',
	},
	pricingListTextView: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		width: '100%',
	},

	pricingListButtonView: { paddingVertical: theme.padding.sm },
	viewMoreText: (hasValue: boolean) => ({
		textDecorationLine: hasValue ? 'underline' : 'none',
	}),
	tableContainer: (sentByMe: boolean) => ({
		backgroundColor: sentByMe ? '#28251E' : theme.colors.backgroundDarkBlack,
		borderWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	}),
	tableHeading: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		minWidth: '33.33%',
		maxWidth: '33.33%',
		padding: theme.padding.base,
		color: theme.colors.success,
		fontWeight: theme.fontWeight.bold,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	totalAmountView: (gridSize: number = 3) => ({
		minWidth: `${100 - 100 / gridSize}%`,
		maxWidth: `${100 - 100 / gridSize}%`,
	}),
	totalAmountText: {
		padding: theme.padding.base,
		borderColor: theme.colors.borderGray,
	},
	topTableContainer: {
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
	termsAndConditionsContainer: {
		padding: theme.padding.sm,
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	pricingListContainer: { borderTopWidth: theme.borderWidth.slim, borderBottomWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray },
	body: {
		maxWidth: '100%',
	},
	field: {
		paddingVertical: theme.padding.xs,
		paddingHorizontal: theme.padding.xs,
		borderTopWidth: theme.borderWidth.slim,
		borderTopColor: theme.colors.borderGray,
		alignItems: 'center',
	},
	footer: {
		minWidth: '100%',
		flexDirection: 'row',
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderTopColor: theme.colors.borderGray,
	},
	button: (disabled: boolean) => ({
		flex: 1,
		opacity: disabled ? 0.6 : 1,
	}),
	tableRow: {
		flexDirection: 'row',
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	tableColumn: {
		flexDirection: 'column',
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	tableContent: {
		minWidth: '60%',
		maxWidth: '60%',
		backgroundColor: theme.colors.black,
		flex: 1,
		padding: theme.padding.sm,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	tableHeadingColumn: {
		minWidth: '33.33%',
		maxWidth: '33.33%',
		padding: theme.padding.sm,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	tableHeadingColumn1: (gridSize: number = 3) => ({
		minWidth: `${100 / gridSize}%`,
		maxWidth: `${100 / gridSize}%`,
		padding: theme.padding.sm,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	}),
	tableHeadingColumn2: {
		minWidth: '25%',
		maxWidth: '25%',
		padding: theme.padding.sm,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	tableContentColumn2: {
		minWidth: '25%',
		maxWidth: '25%',
		padding: theme.padding.sm,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	tableContentColumn: (gridSize: number = 3) => ({
		minWidth: `${100 / gridSize}%`,
		maxWidth: `${100 / gridSize}%`,
		padding: theme.padding.sm,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	}),
}));

export default StudioClaim;
