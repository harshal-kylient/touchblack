import EnumProjectStatus from '@models/enums/EnumProjectStatus';
import { useAuth } from '@presenters/auth/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Close, Success } from '@touchblack/icons';
import { Button, Text } from '@touchblack/ui';
import { View } from 'react-native';
import { useStyles } from 'react-native-unistyles';

export default function PaymentMessage({ item, status }) {
	const navigation = useNavigation();
	const { theme } = useStyles();
	const { loginType } = useAuth();
	const Item = JSON.parse(item.content);
	const isDisabled = status !== EnumProjectStatus.Completed;

	return (
		<View style={{ minWidth: '100%' }}>
			<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: theme.padding.sm, paddingHorizontal: theme.padding.sm, backgroundColor: '#50483B', borderBottomWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
				<Text size="bodyMid" color="muted">
					Payment to {Item?.talent_first_name}
				</Text>
			</View>
			<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: theme.padding.sm, paddingHorizontal: theme.padding.sm, backgroundColor: 'rgba(0,0,0,0.5)', borderBottomWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
				<Text size="primaryBig" color="regular">
					₹ {Item?.amount}
				</Text>
			</View>
			{Item.message === 'Payment failed' ? (
				<>
					<View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: theme.padding.sm, paddingHorizontal: theme.padding.sm, backgroundColor: 'rgba(77, 0, 0, 0.1)', borderBottomWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
						<View style={{ backgroundColor: 'rgb(216, 89, 89)', borderRadius: 50 }}>
							<Close size="24" color={theme.colors.backgroundDarkBlack} />
						</View>

						<Text size="bodySm" color="muted">
							{'  '} {Item?.message}
						</Text>
					</View>
					{/* <Button textColor="black" type="primary" style={{ backgroundColor: theme.colors.primary, paddingVertical: 14, borderColor: theme.colors.borderGray, borderWidth: 1 }}>
						Pay ₹ {Item?.amount}
					</Button> */}
				</>
			) : (
				<>
					<View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: theme.padding.sm, paddingHorizontal: theme.padding.sm, backgroundColor: 'rgba(97, 139, 90, 0.4)', borderBottomWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
						<Success size="24" color={theme.colors.success} />
						<Text size="bodySm" color="regular">
							{'  '} {Item?.message}
						</Text>
					</View>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: theme.padding.sm, paddingHorizontal: theme.padding.sm, backgroundColor: 'rgba(0,0,0,0.5)', borderBottomWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
						<Text size="bodySm" color="muted">
							Transaction ID
						</Text>
						<Text size="bodySm" color="regular">
							{'   '}
							{Item?.transaction_id}
						</Text>
					</View>
				</>
			)}

			<View style={{ borderTopWidth: theme.borderWidth.slim, borderColor: '#fff4' }}>
				<Text style={{ color: theme.colors.success, fontWeight: 'bold', paddingVertical: theme.padding.xxs, paddingHorizontal: theme.padding.base }} textAlign="right" size="bodyMid">
					{item?.sender_name}
				</Text>
			</View>
		</View>
	);
}
