import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Button, Text } from '@touchblack/ui';

import { formatAmount } from '@utils/formatCurrency';
import IMessageItem from '@models/entities/IMessageItem';
import { useAuth } from '@presenters/auth/AuthContext';
import useSentByMe from './useSentByMe';

interface IProps {
	item: IMessageItem;
}

export default function StudioConfirmation({ item }: IProps) {
	const { styles, theme } = useStyles(stylesheet);
	const { loginType, permissions } = useAuth();
	const sentByMe = useSentByMe(item);
	const active = loginType === 'producer' ? permissions?.includes('Messages::Edit') : true;

	return (
		<View style={styles.body}>
			<View style={{ minWidth: '100%', padding: theme.padding.base, flexDirection: 'row', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
				<Text size="bodyBig" color="regular">
					The project got accepted at{' '}
					<Text size="bodyMid" color="regular" style={{ fontFamily: theme.fontFamily.cgMedium, fontWeight: 'bold' }}>
						{formatAmount(item?.content?.negotiation?.amount)}
					</Text>
					.{Boolean(Number(item?.content?.negotiation?.advance_amount)) && `(GST Excl.)\n${loginType === 'producer' ? 'Please make an advance payment of ' : 'Producer will soon make an advance payment of'}`}
					{Boolean(Number(item?.content?.negotiation?.advance_amount)) && (
						<Text size="bodyMid" color="regular" style={{ fontFamily: theme.fontFamily.cgMedium, fontWeight: 'bold' }}>
							{' '}
							{formatAmount(item?.content?.negotiation?.advance_amount)}{' '}
						</Text>
					)}
					{Boolean(Number(item?.content?.negotiation?.advance_amount)) && 'to tentatively confirm the booking.'}
				</Text>
			</View>
			{loginType === 'producer' && (
				<Button isDisabled={!active} style={styles.button(!active)} onPress={() => {}}>
					Pay ₹ {item?.content?.negotiation?.advance_amount}/-
				</Button>
			)}
			<View style={styles.senderNameView}>
				<Text style={styles.senderName} textAlign={sentByMe ? 'right' : 'left'} size="bodyMid">
					{item?.content?.sender_name}
				</Text>
			</View>
		</View>
	);
}

const stylesheet = createStyleSheet(theme => ({
	currentClaim: {
		gap: theme.gap.steps,
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: '#28251e',
		padding: theme.padding.xs,
		borderColor: '#fff4',
		borderTopWidth: theme.borderWidth.slim,
		alignItems: 'center',
	},
	senderNameView: {
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	senderName: {
		color: theme.colors.success,
		fontWeight: 'bold',
		paddingVertical: theme.padding.xxs,
		paddingHorizontal: theme.padding.base,
	},
	currentClaimText: {},
	body: {
		minWidth: '100%',
	},
	button: (disabled: boolean) => ({
		opacity: disabled ? 0.6 : 1,
	}),
	field: {
		paddingVertical: theme.padding.xs,
		paddingHorizontal: theme.padding.xs,
		borderTopWidth: theme.borderWidth.slim,
		borderTopColor: '#fff4',
		alignItems: 'center',
	},
}));
