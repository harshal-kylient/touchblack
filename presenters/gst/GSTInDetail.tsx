import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import Header from '@components/Header';
import useGetGSTDetails from '@network/useGetGSTDetails';
import LoadingScreen from '@presenters/loader/LoaderScreen';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import useGetStates from '@network/useGetStates';

const GSTInDetails = ({ route }) => {
	const { id, role } = route.params || {};
	const { styles, theme } = useStyles(stylesheet);
	const { data: states = [], isLoading: isStatesLoading } = useGetStates();
	const { data: gstDetails, isLoading: isGSTDetailsLoading } = useGetGSTDetails(id, role);

	const LabelValue = ({ label, value }: { label: string; value: string }) => (
		<View style={styles.item}>
			<Text style={styles.label}>{label}</Text>
			<Text style={styles.value}>{value}</Text>
		</View>
	);
	const stateName = states.find(state => state.id === gstDetails?.data?.state_id)?.name;
	return (
		<SafeAreaView style={styles.container}>
			<Header name="GSTIN Details" />
			{isGSTDetailsLoading ? (
				<View style={styles.loaderContainer}>
					<LoadingScreen />
				</View>
			) : gstDetails ? (
				<ScrollView contentContainerStyle={styles.content}>
					<LabelValue label="GSTIN" value={gstDetails?.data?.gstin || 'N/A'} />
					<LabelValue label="Legal Name/ Trade name" value={gstDetails?.data?.legal_name || 'N/A'} />
					<LabelValue label="Address" value={gstDetails?.data?.address || 'N/A'} />
					<LabelValue label="State" value={stateName || 'N/A'} />
					<LabelValue label="Pincode" value={gstDetails?.data?.gst_pincode || 'N/A'} />
				</ScrollView>
			) : (
				<View style={styles.loaderContainer}>
					<Text style={styles.errorText}>Failed to load GST details.</Text>
				</View>
			)}
		</SafeAreaView>
	);
};

const stylesheet = createStyleSheet(theme => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingTop: 60,
		paddingHorizontal: 16,
		paddingBottom: 24,
	},

	content: {
		padding: theme.padding.base,
		marginTop: theme.margins.base,
	},
	item: {
		paddingVertical: theme.padding.xs,
	},
	label: {
		color: theme.colors.muted,
		fontSize: theme.fontSize.cardSubHeading,
		marginBottom: theme.margins.xxs,
	},
	value: {
		color: theme.colors.typography,
		fontSize: theme.fontSize.typographyMd,
	},

	loaderContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	errorText: {
		color: '#FF6B6B',
		fontSize: 16,
		fontWeight: '500',
	},
}));

export default GSTInDetails;
