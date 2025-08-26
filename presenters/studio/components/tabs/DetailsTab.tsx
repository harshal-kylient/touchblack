import { Linking, Pressable, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Text } from '@touchblack/ui';
import { TableRow } from '../TableRow';
import { IStudioFloor } from '@models/entities/IStudioFloor';
import capitalized from '@utils/capitalized';
import { useNavigation } from '@react-navigation/native';
import useGetLocationVideos from '@network/useGetLocationVideos';
import useGetStudioServices from '@network/useGetStudioServices';
import createAbsoluteImageUri from '@utils/createAbsoluteImageUri';

interface DetailsTabProps {
	floorDetails: IStudioFloor;
}

export const DetailsTab: React.FC<DetailsTabProps> = ({ floorDetails }) => {
	const { styles, theme } = useStyles(stylesheet);
	const navigation = useNavigation();
	const { data: response1 } = useGetLocationVideos(floorDetails?.id);
	const locationVideos = response1?.data || [];
	const { data: response2 } = useGetStudioServices(floorDetails?.id);
	const studioServices = response2?.data || [];

	const TABLE_DATA = [
		['Type of Location', capitalized(floorDetails?.location_type) || 'Not Available'],
		['Business Owner', capitalized(floorDetails?.owner) || 'Not Available'],
		['Location Address', floorDetails?.address || 'Not Available'],
		['About', floorDetails?.about || 'Not Available'],
		['Working hours', `${floorDetails?.start_time ? `${floorDetails?.start_time}:00` : 'Not Available'} - ${floorDetails?.end_time ? `${floorDetails?.end_time}:00` : 'Not Available'}`],
		['Shift duration (minimum number of hours)', floorDetails?.shift_duration ? `${floorDetails?.shift_duration} hrs.` : 'Not Available'],
		['Extra hr. charges', floorDetails?.extra_hour_charges ? `₹ ${floorDetails?.extra_hour_charges}` : 'Not Available'],
		['Setting day charges', floorDetails?.setting_day_charges ? `₹ ${floorDetails?.setting_day_charges}` : 'Not Available'],
		['Number of setting days allowed', floorDetails?.number_of_setting_days_allowed || 'Not Available'],
		['Advance Booking amount', floorDetails?.advance_booking_amount ? `₹ ${floorDetails?.advance_booking_amount}` : 'Not Available'],
		['Location Floor Dimensions', `${floorDetails?.length || ' Not Available '}(L) x ${floorDetails?.breadth || ' Not Available '}(W) x ${floorDetails?.height || ' Not Available '}(H) Ft.`],
		['Location Floor Area', floorDetails?.studio_floor_area ? `${floorDetails?.studio_floor_area} Sq. Ft.` : 'Not Available'],
		['Outdoor area for set construction', floorDetails?.outdoor_area_for_set_construction ? `${floorDetails?.outdoor_area_for_set_construction} Sq. Ft.` : 'Not Available'],
		['Access Door size', `${floorDetails?.access_door_breadth || ' Not Available '}(W) x ${floorDetails?.access_door_length || ' Not Available '}(H) Ft.`],
	];

	function handleLocationVideoTransfer(filmDetails: { name: string; link: string; id: UniqueId }) {
		navigation.navigate('FullScreenVideoPlayer', { header: filmDetails?.name, link: filmDetails?.link });
	}

	return (
		<>
			<View style={{ flex: 1, marginTop: theme.margins.base, borderTopWidth: theme.borderWidth.slim, borderBottomWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
				<View style={styles.tableContainer}>
					{TABLE_DATA.map((item, index) => (
						<TableRow key={index} heading={item[0]} text={item[1]} />
					))}
					<View style={styles.tableRow}>
						<View style={styles.tableHeading}>
							<Text color="regular" size="bodyMid">
								Cancellation Terms
							</Text>
						</View>
						<Pressable onPress={floorDetails?.cancellation_terms_url ? () => Linking.openURL(createAbsoluteImageUri(floorDetails?.cancellation_terms_url)) : () => {}} style={styles.tableContent}>
							<Text size="bodyMid" style={styles.viewMoreText(!!floorDetails?.cancellation_terms_url)} color="primary">
								{floorDetails?.cancellation_terms_url ? 'View' : 'Not Available'}
							</Text>
						</Pressable>
					</View>
					<View style={styles.tableRow}>
						<View style={styles.tableHeading}>
							<Text color="regular" size="bodyMid">
								Location rules and regulations
							</Text>
						</View>
						<Pressable onPress={floorDetails?.rules_and_regulations_url ? () => Linking.openURL(createAbsoluteImageUri(floorDetails?.rules_and_regulations_url)) : () => {}} style={styles.tableContent}>
							<Text size="bodyMid" style={styles.viewMoreText(!!floorDetails?.rules_and_regulations_url)} color="primary">
								{floorDetails?.rules_and_regulations_url ? 'View' : 'Not Available'}
							</Text>
						</Pressable>
					</View>
					<View style={styles.tableRow}>
						<View style={styles.tableHeading}>
							<Text color="regular" size="bodyMid">
								Location Brochure
							</Text>
						</View>
						<Pressable onPress={floorDetails?.brochure_url ? () => Linking.openURL(createAbsoluteImageUri(floorDetails?.brochure_url)) : () => {}} style={styles.tableContent}>
							<Text size="bodyMid" style={styles.viewMoreText(!!floorDetails?.brochure_url)} color="primary">
								{floorDetails?.brochure_url ? 'View' : 'Not Available'}
							</Text>
						</Pressable>
					</View>
					<View style={styles.tableRow}>
						<View style={styles.tableHeading}>
							<Text color="regular" size="bodyMid">
								Location Floor Plan
							</Text>
						</View>
						<Pressable onPress={floorDetails?.studio_floor_plan_url ? () => Linking.openURL(createAbsoluteImageUri(floorDetails?.studio_floor_plan_url)) : () => {}} style={styles.tableContent}>
							<Text size="bodyMid" style={styles.viewMoreText(!!floorDetails?.studio_floor_plan_url)} color="primary">
								{floorDetails?.studio_floor_plan_url ? 'View' : 'Not Available'}
							</Text>
						</Pressable>
					</View>
					<View style={styles.tableRow}>
						<View style={styles.tableHeading}>
							<Text color="regular" size="bodyMid">
								Location video
							</Text>
						</View>
						<View style={{ flex: 1 }}>
							{locationVideos?.map(it => (
								<View key={it?.id} style={[styles.tableContent, { minWidth: '100%', flex: 1, borderBottomWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }]}>
									<Text size="bodyBig" color="regular">
										{capitalized(it?.name)}
									</Text>
									<Pressable onPress={() => handleLocationVideoTransfer(it)}>
										<Text size="bodyMid" style={styles.viewMoreText(true)} color="primary">
											Play
										</Text>
									</Pressable>
								</View>
							))}
						</View>
					</View>
				</View>
			</View>
			{Boolean(studioServices?.length) && (
				<View style={{ marginTop: 2 * theme.margins.xl, marginBottom: theme.margins.base }}>
					<Text style={{ paddingHorizontal: theme.padding.base }} size="primaryMid" color="regular">
						Standard Rate Card
					</Text>
					<View style={{ flex: 1, marginTop: theme.margins.base, borderTopWidth: theme.borderWidth.slim, borderBottomWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
						<View style={{ marginHorizontal: theme.margins.base, borderLeftWidth: theme.borderWidth.slim, borderRightWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
							{studioServices?.map(it => (
								<TableRow heading={it?.name} text={'₹ ' + it?.price} />
							))}
						</View>
					</View>
				</View>
			)}
		</>
	);
};

const stylesheet = createStyleSheet(theme => ({
	tableRow: {
		flexDirection: 'row',
		borderBottomWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	tableHeading: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		minWidth: '40%',
		maxWidth: '40%',
		padding: theme.padding.base,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	tableContent: {
		minWidth: '60%',
		maxWidth: '60%',
		backgroundColor: theme.colors.black,
		flex: 1,
		padding: theme.padding.base,
	},
	tableContainer: {
		marginHorizontal: theme.padding.base,
		backgroundColor: theme.colors.black,
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	cancellationPolicy: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: theme.padding.base,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	viewMoreText: (hasValue: boolean) => ({
		textDecorationLine: hasValue ? 'underline' : 'none',
	}),
}));
