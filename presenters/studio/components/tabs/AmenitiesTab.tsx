import React from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { TableRow } from '../TableRow';
import { IStudioFloor } from '@models/entities/IStudioFloor';
import capitalized from '@utils/capitalized';

interface AmenitiesTabProps {
	floorDetails: IStudioFloor;
}

export const AmenitiesTab: React.FC<AmenitiesTabProps> = ({ floorDetails: data }) => {
	const { styles } = useStyles(stylesheet);

	const AMENITIES_DATA = [
		{ label: 'Adjoining Location floors', value: data?.adjoining_studio_floors || 'Not Available' },
		{ label: 'Chroma Set up', value: data?.chroma_setup_length || data?.chroma_setup_width || data?.chroma_setup_height ? `${data?.chroma_setup_length ? data?.chroma_setup_length + ' (L) x ' : ''}${data?.chroma_setup_width ? data?.chroma_setup_width + ' (W) x ' : ''}${data?.chroma_setup_height ? data?.chroma_setup_height + ' (H) Ft.' : ''}` : 'Not Available' },
		{ label: 'Chroma colour', value: capitalized(data?.chroma_color) || 'Not Available' },
		{ label: 'Attached room', value: data?.attached_room || 'Not Available' },
		{ label: 'Crew washroom', value: data?.crew_washroom || 'Not Available' },
		{ label: 'Makeup room', value: data?.makeup_room || 'Not Available' },
		{ label: 'Celebrity lounges', value: data?.celebrity_lounges || 'Not Available' },
		{ label: 'Large vehicle parking space', value: data?.large_vehicle_parking_space || 'Not Available' },
		{ label: 'Car parking space', value: data?.car_parking_space || 'Not Available' },
		{ label: 'Catwalk/Tarafa', value: data?.catwalk_height ? `${data?.catwalk_height} Ft. from ground` : 'Not Available' },
		{ label: 'Soundproof', value: `${data?.is_soundproof ? 'Available' : 'Not Available'}` },
		{ label: 'Air conditioning', value: `${data?.is_air_conditioned && data?.air_conditioning_capacity ? data?.air_conditioning_capacity + ' tons' : 'Not Available'}` },
		{ label: 'Generator backup', value: `${data?.generator_backup ? data?.generator_backup_capacity + ' KW' : 'Not Available'}` },
		{ label: 'Fire Detectors', value: `${data?.fire_detectors ? 'Available' : 'Not Available'}` },
		{ label: 'Kitchen Room', value: `${data?.kitchen_room ? 'Available' : 'Not Available'}` },
		{ label: 'Dining Room', value: `${data?.dining_room ? 'Available' : 'Not Available'}` },
		{ label: 'Wireless internet access', value: `${data?.wireless_internet_access ? 'Available' : 'Not Available'}` },
		{ label: 'VIP board room', value: data?.vip_board_room_count ? String(data?.vip_board_room_count)?.padStart(2, '0') : 'Not Available' },
	];

	return (
		<View style={styles.tableContainer}>
			{AMENITIES_DATA.map((item, index) => (
				<TableRow key={index} heading={item.label} text={typeof item.value === 'boolean' ? (item.value ? 'Yes' : 'No') : item.value?.toString() ?? ''} />
			))}
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
}));
