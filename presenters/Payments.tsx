import Header from '@components/Header';
import { Image, Pressable, SafeAreaView, ScrollView, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { Text } from '@touchblack/ui';
import { formatAmount } from '@utils/formatCurrency';
import Upcoming from '@components/errors/Upcoming';

interface TransactionHistory {
	id: number;
	amount: number;
	date: string;
	time: string;
	image: string;
	name: string;
	description: string;
	medium: string;
}

function Payments() {
	const { styles, theme } = useStyles(stylesheet);

	const renderTransactionHistory: ListRenderItem<TransactionHistory> = ({ item }) => (
		<Pressable key={item.id} onPress={() => {}} style={styles.transactionHistoryItem} accessibilityRole="button">
			<Image source={{ uri: item.image }} style={styles.transactionHistoryImage} accessibilityLabel="Team member image" />
			<View style={styles.transactionHistoryDetails}>
				<View style={styles.senderDetails}>
					<Text size="bodyBig" color="regular" weight="bold" style={{ lineHeight: 22, opacity: 0.8 }} numberOfLines={1}>
						{item.name}
					</Text>
					<Text size="bodySm" color="regular" style={{ lineHeight: 14, opacity: 0.8 }} numberOfLines={1}>
						{item.date}, {item.time}
					</Text>
				</View>
				<View style={styles.paymentDetails}>
					<Text size="secondary" color="regular" weight="bold" style={{ lineHeight: 22, opacity: 0.8 }} numberOfLines={1}>
						{formatAmount(item.amount.toString())}
					</Text>
					<Text size="bodySm" color="regular" style={{ lineHeight: 14, opacity: 0.8 }} numberOfLines={1}>
						{item.medium}
					</Text>
				</View>
			</View>
		</Pressable>
	);

	return (
		<SafeAreaView style={styles.container}>
			<Header name="Payments" />
			<ScrollView contentContainerStyle={styles.scrollContainer}>
				<View style={styles.upcomingContainer}>
					<Upcoming />
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundDarkBlack,
		gap: 40,
	},
	scrollContainer: {
		width: '100%',
	},
	upcomingContainer: { flex: 1, backgroundColor: theme.colors.black, justifyContent: 'center' },
	transactionHistoryContainer: {
		borderBottomWidth: theme.borderWidth.slim,
		borderBottomColor: theme.colors.borderGray,
		paddingBottom: theme.padding.base,
		flexDirection: 'row',
		alignItems: 'center',
	},
	transactionHistoryItem: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: theme.gap.base,
		paddingHorizontal: theme.padding.base,
		borderBottomWidth: theme.borderWidth.slim,
		borderBottomColor: theme.colors.borderGray,
	},
	transactionHistoryDetails: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		flex: 1,
	},
	subtitleText: {
		paddingHorizontal: theme.padding.base,
	},
	transactionHistoryImage: {
		width: 64,
		height: 64,
	},
	senderDetails: {
		// flex: 1
	},
	paymentDetails: {
		alignItems: 'flex-end',
	},
}));

export default Payments;

const TRANSACTION_HISTORY: TransactionHistory[] = [
	{
		id: 1,
		amount: 100,
		date: '2021-01-01',
		time: '12:00',
		image: 'https://via.placeholder.com/150',
		name: 'John Doe',
		description: 'Payment for booking 1',
		medium: 'PhonePe',
	},
	{
		id: 2,
		amount: 100,
		date: '2021-01-01',
		time: '12:00',
		image: 'https://via.placeholder.com/150',
		name: 'John Doe',
		description: 'Payment for booking 1',
		medium: 'PhonePe',
	},
	{
		id: 3,
		amount: 100,
		date: '2021-01-01',
		time: '12:00',
		image: 'https://via.placeholder.com/150',
		name: 'John Doe',
		description: 'Payment for booking 1',
		medium: 'Gpay',
	},
	{
		id: 4,
		amount: 100,
		date: '2021-01-01',
		time: '12:00',
		image: 'https://via.placeholder.com/150',
		name: 'John Doe',
		description: 'Payment for booking 1',
		medium: 'Paytm',
	},
	{
		id: 5,
		amount: 100,
		date: '2021-01-01',
		time: '12:00',
		image: 'https://via.placeholder.com/150',
		name: 'John Doe',
		description: 'Payment for booking 1',
		medium: 'Paytm',
	},
	{
		id: 6,
		amount: 100,
		date: '2021-01-01',
		time: '12:00',
		image: 'https://via.placeholder.com/150',
		name: 'John Doe',
		description: 'Payment for booking 1',
		medium: 'Paytm',
	},
	{
		id: 7,
		amount: 100,
		date: '2021-01-01',
		time: '12:00',
		image: 'https://via.placeholder.com/150',
		name: 'John Doe',
		description: 'Payment for booking 1',
		medium: 'Paytm',
	},
	{
		id: 8,
		amount: 100,
		date: '2021-01-01',
		time: '12:00',
		image: 'https://via.placeholder.com/150',
		name: 'John Doe',
		description: 'Payment for booking 1',
		medium: 'Paytm',
	},
];
