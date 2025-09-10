import React from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { TabType } from '../StudioFloorDetails';
import { DetailsTab } from './tabs/DetailsTab';
import { AmenitiesTab } from './tabs/AmenitiesTab';
import { PhotosTab } from './tabs/PhotosTab';
import { PricingListTab } from './tabs/PricingListTab';
import { IStudioFloor } from '@models/entities/IStudioFloor';

interface TabContentProps {
	activeTab: TabType;
	floorDetails: IStudioFloor;
	floorId: string;
}

export const TabContent: React.FC<TabContentProps> = ({ floorId, activeTab, floorDetails }) => {
	const { styles } = useStyles(stylesheet);

	return (
		<View style={styles.contentContainer}>
			{activeTab === 'Details' && <DetailsTab floorDetails={floorDetails} />}
			{activeTab === 'Amenities' && <AmenitiesTab floorDetails={floorDetails} />}
			{activeTab === 'Photos' && <PhotosTab floorId={floorId} />}
			{activeTab === 'Pricing List' && <PricingListTab floorDetails={floorDetails} />}
		</View>
	);
};

const stylesheet = createStyleSheet(theme => ({
	contentContainer: {
		paddingTop: theme.margins.xxl,
		backgroundColor: theme.colors.black,
	},
}));
