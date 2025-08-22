import { memo, useCallback } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { SheetManager } from 'react-native-actions-sheet';
import { Button, Text } from '@touchblack/ui';
import { FieldItem } from './FieldItem';
import { SheetType } from 'sheets';
import { formatAmount } from '@utils/formatCurrency';
import server from '@utils/axios';
import CONSTANTS from '@constants/constants';
import { useAuth } from '@presenters/auth/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import IMessageItem from '@models/entities/IMessageItem';
import useSentByMe from './useSentByMe';

interface IProps {
	onCounter?: () => void;
	onConfirm?: () => void;
	last_negotiation_id: UniqueId;
	last_negotiation_status: 'pending' | 'confirmed';
	item: IMessageItem;
}

const ClaimMessage = memo(({ onCounter, onConfirm, item, last_negotiation_id, last_negotiation_status }: IProps) => {
	const { styles, theme } = useStyles(stylesheet);
	const { loginType, permissions } = useAuth();
	const enabled = last_negotiation_id === item?.content?.negotiation?.id && last_negotiation_status === 'pending';
	const conversation_id = item?.content?.negotiation?.conversation_id;
	const sentByMe = useSentByMe(item);
	const sender_name = sentByMe ? 'You' : item?.sender_name;
	const queryClient = useQueryClient();

	const handleCounter = useCallback(() => {
		if (onCounter) {
			onCounter();
		}
		SheetManager.show('Drawer', {
			payload: {
				sheet: SheetType.ReviseClaim,
				data: {
					sender_name,
					conversation_id,
					negotiation_id: item?.content?.negotiation?.id,
					comments: item?.content?.negotiation?.comments,
					cancellation_charges: item?.content?.negotiation?.cancellation_charges,
					payment_terms: item?.content?.negotiation?.payment_terms,
					gst_applicable: item?.content?.negotiation?.gst_applicable,
					amount: item?.content?.negotiation?.amount,
					onSuccess: async () => await queryClient.invalidateQueries(['useGetAllMessages', conversation_id]),
				},
			},
		});
	}, [onCounter, sender_name, conversation_id, item?.content?.negotiation]);

	const handleConfirm = useCallback(async () => {
		if (onConfirm) {
			onConfirm();
		}
		try {
			const response = await server.post(CONSTANTS.endpoints.accept_claim(item?.content?.negotiation?.id));
			if (response.data?.success) {
				SheetManager.show('Drawer', {
					payload: {
						sheet: SheetType.Success,
						data: {
							header: 'Wohoo!',
							text: response.data?.message,
							onPress: async () => {
								await queryClient.invalidateQueries(['useGetAllMessages', conversation_id]);
								await queryClient.invalidateQueries('useGetTalentCalendarList');
								await queryClient.invalidateQueries('useGetProducerCalendarList');
							},
						},
					},
				});
			}
		} catch (error) {}
	}, [onConfirm, item?.content?.negotiation?.id]);

	const isConfirmedOrDisabled = !(loginType === 'producer' ? permissions?.includes('Project::Edit') && enabled : enabled);

	return (
		<>
			<View style={styles.header(sentByMe)}>
				<Text size="cardHeading" color="muted">
					{sender_name} Claimed
				</Text>
				<Text size="cardHeading" weight="bold" color="regular">
					{formatAmount(item?.content?.negotiation?.amount)}/-
				</Text>
			</View>
			<View style={styles.body}>
				<FieldItem orientation="row" label="Payment Terms:" value={item?.content?.negotiation?.payment_terms ? `${item?.content?.negotiation?.payment_terms} days` : '-'} style={styles.field} />
				<FieldItem orientation="row" label="Cancellation Charges:" style={styles.field} value={`${formatAmount(item?.content?.negotiation?.cancellation_charges)}`} />
				<FieldItem orientation="row" label="Note:" style={styles.field} value={item?.content?.negotiation?.comments} />
			</View>
			{!sentByMe && (
				<View style={styles.footer}>
					<Button isDisabled={isConfirmedOrDisabled} type="secondary" textColor="regular" onPress={handleCounter} style={styles.button(isConfirmedOrDisabled)}>
						Revise Claim
					</Button>
					<Button isDisabled={isConfirmedOrDisabled} type="primary" onPress={handleConfirm} style={styles.button(isConfirmedOrDisabled)}>
						Accept Claim
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
		backgroundColor: sentByMe ? '#28251e' : theme.colors.black,
		padding: theme.padding.xs,
		alignItems: 'center',
	}),
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
		borderTopColor: theme.colors.borderGray,
	},
	button: (disabled: boolean) => ({
		flex: 1,
		opacity: disabled ? 0.6 : 1,
	}),
}));

export default ClaimMessage;
