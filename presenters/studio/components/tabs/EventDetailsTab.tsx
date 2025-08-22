import React from 'react';
import { View, Pressable, Linking } from 'react-native';
import { Text } from '@touchblack/ui';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { IEventDetails } from '@models/entities/IEventDetails';

interface EventDetailsTabProps {
	floorDetails: IEventDetails;
}

export const EventDetailsTab: React.FC<EventDetailsTabProps> = ({ floorDetails }) => {
	const { styles } = useStyles(stylesheet);

	function getDuration(start: string, end: string): string {
		const [startHour, startMin] = start.split(':').map(Number);
		const [endHour, endMin] = end.split(':').map(Number);
		let diff = endHour * 60 + endMin - (startHour * 60 + startMin);
		if (diff < 0) diff += 24 * 60;
		const hours = Math.floor(diff / 60);
		const minutes = diff % 60;
		return `${hours} hrs${minutes > 0 ? ` ${minutes} min` : ''}`;
	}

	const handleOpenURL = (url: string) => {
		if (url) Linking.openURL(url);
	};

	const EVENT_DETAILS = [
		{ label: 'Event Type', value: floorDetails?.event_type || 'Not Available' },
		{ label: 'Languages', value: floorDetails?.languages?.join(', ') || 'Not Available' },
		{ label: 'Event Date', value: floorDetails?.event_date || 'Not Available' },
		{ label: 'Time', value: floorDetails?.start_time && floorDetails?.end_time ? `${floorDetails.start_time} - ${floorDetails.end_time}` : 'Not Available' },
		{ label: 'Duration', value: floorDetails?.start_time && floorDetails?.end_time ? getDuration(floorDetails.start_time, floorDetails.end_time) : 'Not Available' },
		{ label: 'Venue Name', value: floorDetails?.venue_name || 'Not Available' },
		{ label: 'Address Details', value: floorDetails?.address_details || 'Not Available' },
		{ label: 'Layout', value: floorDetails?.layout || 'Not Available' },
		{ label: 'Entry Type', value: floorDetails?.entry_type || 'Not Available' },
		{ label: 'Registration Deadline', value: floorDetails?.registration_deadline || 'Not Available' },
		{ label: 'Max Capacity', value: floorDetails?.max_capacity || 'Not Available' },
		{ label: 'Instructions', value: floorDetails?.instructions || 'Not Available' },
		{
			label: 'T&C',
			customRightComponent: floorDetails?.tnc_document_url ? (
				<Pressable onPress={() => handleOpenURL(floorDetails.tnc_document_url)}>
					<Text size="bodySm" color="primary" style={{ textDecorationLine: 'underline' }}>
						View
					</Text>
				</Pressable>
			) : (
				<Text size="bodySm" color="regular">
					Not Available
				</Text>
			),
		},
		{ label: 'Facilities Provided', value: floorDetails?.facilities?.join(', ') || 'Not Available' },
		{ label: 'Target Roles', value: floorDetails?.roles?.join(', ') || 'Not Available' },
		{ label: 'Access Level', value: floorDetails?.access_level },
	];

	return (
		<View style={styles.tableContainer}>
			{EVENT_DETAILS.map((item, index) => (
				<TableRow key={index} heading={item.label} text={item.value} customRightComponent={item.customRightComponent} />
			))}
		</View>
	);
};

interface TableRowProps {
	heading: string;
	text?: string;
	customRightComponent?: React.ReactNode;
}

const TableRow: React.FC<TableRowProps> = ({ heading, text, customRightComponent }) => {
	const { styles } = useStyles(stylesheet);

	return (
		<View style={styles.tableRow}>
			<View style={styles.tableHeading}>
				<Text color="muted" size="bodySm">
					{heading}
				</Text>
			</View>
			<View style={styles.tableContent}>
				{customRightComponent ? (
					customRightComponent
				) : (
					<Text color="regular" size="bodySm">
						{text ?? 'Not Available'}
					</Text>
				)}
			</View>
		</View>
	);
};

const stylesheet = createStyleSheet(theme => ({
	tableContainer: {
		backgroundColor: theme.colors.black,
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		paddingHorizontal: theme.padding.base,
	},
	tableRow: {
		flexDirection: 'row',
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	tableHeading: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		minWidth: '40%',
		maxWidth: '40%',
		padding: theme.padding.base,
		borderTopWidth: theme.borderWidth.slim,
		borderLeftWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	tableContent: {
		minWidth: '60%',
		maxWidth: '60%',
		backgroundColor: theme.colors.black,
		flex: 1,
		justifyContent: 'center',
		padding: theme.padding.sm,
		borderTopWidth: theme.borderWidth.slim,
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
}));
