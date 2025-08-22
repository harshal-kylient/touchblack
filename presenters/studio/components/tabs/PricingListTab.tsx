import { Linking, Pressable, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Text } from '@touchblack/ui';
import { TableRow, TableRowTopHeading } from '../TableRow';
import { IStudioFloor } from '@models/entities/IStudioFloor';
import { useEffect, useMemo, useState } from 'react';
import ListSelectDropdown from '@components/ListSelectDropdown';
import useGetVideoTypes from '@network/useGetVideoTypes';
import useGetStudioFloorPricing from '@network/useGetStudioFloorPricing';
import useGetStudioFloorPricingByVideoTypeId from '@network/useGetStudioFloorPricingByVideoId';
import createAbsoluteImageUri from '@utils/createAbsoluteImageUri';
import ProjectDetailsLoader from '@presenters/projects/ProjectDetailsLoader';

interface PricingListTabProps {
	floorDetails: IStudioFloor;
}

interface PricingItem {
	id: string;
	name: string;
	price?: number;
}

interface VideoType {
	id: string;
	name: string;
}

interface PricingData {
	id: string;
	name: string;
	total_price_per_shift?: number;
}

interface DetailedPricingResponse {
	data: PricingItem[];
	tnc_url: string;
}

/**
 * Finds an item in an array by name (case-insensitive)
 * @param name - The name to search for
 * @param array - The array to search in
 * @returns The found item or undefined
 */
const findByName = <T extends { name?: string }>(name?: string, array?: T[]): T | undefined => {
	if (!name || !array?.length) return undefined;

	return array.find(item => item?.name?.toLowerCase() === name?.toLowerCase());
};

/**
 * PricingListTab displays pricing information for studio floor bookings
 * based on selected shoot type
 */
export const PricingListTab: React.FC<PricingListTabProps> = ({ floorDetails }) => {
	const { styles, theme } = useStyles(stylesheet);
	const [shootType, setShootType] = useState<VideoType | null>(null);

	// Fetch video types
	const { data: videoTypes, isLoading: videoTypesLoading, error: videoTypesError } = useGetVideoTypes();

	// Fetch pricing for the floor
	const { data: pricing, isLoading: pricingLoading, error: pricingError } = useGetStudioFloorPricing(floorDetails?.id);

	// Find the selected pricing data
	const selected = useMemo(() => findByName<PricingData>(shootType?.name, pricing), [shootType?.name, pricing]);

	// Fetch detailed pricing for the selected video type
	const { data: detailedPricingData, isLoading: detailedPricingLoading, error: detailedPricingError } = useGetStudioFloorPricingByVideoTypeId(selected?.id);

	const { data: detailedPricing, tnc_url } = detailedPricingData || {};

	// Set default shoot type when video types are loaded
	useEffect(() => {
		if (!shootType && videoTypes?.length) {
			setShootType(videoTypes[0]);
		}
	}, [videoTypes, shootType]);

	// Format price with currency symbol
	const formatPrice = (price?: number) => {
		return price !== undefined ? `₹${price}/` : 'Not Available';
	};

	// Handle opening terms and conditions
	const handleOpenTerms = () => {
		if (tnc_url) {
			Linking.openURL(createAbsoluteImageUri(tnc_url)).catch(err => console.error('Error opening terms:', err));
		}
	};

	// Show loading state
	const isLoading = videoTypesLoading || pricingLoading || detailedPricingLoading;
	if (isLoading) return <ProjectDetailsLoader />;

	// Show error state
	const hasError = videoTypesError || pricingError || detailedPricingError;
	if (hasError) return;

	return (
		<View style={styles.container}>
			<Text color="regular" size="bodyBig" style={styles.priceListText}>
				Shoot Type
			</Text>

			<View style={styles.shootTypeContainer}>
				<ListSelectDropdown items={videoTypes || []} itemsToShow={6} onChange={setShootType} value={shootType} accessibilityLabel="Select shoot type" />

				<Text color="regular" size="cardHeading" style={styles.totalText}>
					Total
				</Text>

				<View style={styles.totalPriceContainer}>
					<Text color="regular" size="primaryMid" weight="bold" style={styles.priceListText}>
						{formatPrice(selected?.total_price_per_shift)}
					</Text>

					{selected?.total_price_per_shift && (
						<Text color="regular" size="bodyBig" style={styles.shiftText}>
							shift
						</Text>
					)}
				</View>
			</View>

			{!!detailedPricing?.length && (
				<View style={styles.priceListSection}>
					<Text color="regular" size="bodyBig" style={styles.priceListText}>
						Price List
					</Text>

					<View style={styles.tableWrapper}>
						<View style={styles.tableContainer}>
							<TableRowTopHeading heading="Service" text="Price/Shift" />

							{detailedPricing.map((item, index) => (
								<TableRow key={item.id || index} heading={item?.name || ''} text={item?.price ? `₹ ${item.price}` : ''} />
							))}
						</View>

						<View style={styles.termsAndConditionsContainer}>
							<Text color="regular" size="bodyMid">
								Terms & Conditions
							</Text>

							<Pressable onPress={handleOpenTerms} style={styles.tableContent} accessibilityRole="link" accessibilityLabel="View terms and conditions">
								<Text size="bodyMid" style={styles.viewMoreText} color="primary">
									View
								</Text>
							</Pressable>
						</View>
					</View>
				</View>
			)}
		</View>
	);
};

const stylesheet = createStyleSheet(theme => ({
	container: {
		flex: 1,
	},
	priceListSection: {
		marginTop: theme.margins.sm,
	},
	termsAndConditionsContainer: {
		padding: theme.padding.base,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	totalPriceContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	shootTypeContainer: {
		paddingBottom: theme.padding.base,
		margin: theme.padding.base,
		backgroundColor: theme.colors.black,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	tableContent: {
		backgroundColor: theme.colors.black,
		padding: theme.padding.xs,
	},
	priceListText: {
		paddingHorizontal: theme.padding.base,
	},
	totalText: {
		paddingHorizontal: theme.padding.base,
		paddingBottom: theme.padding.base,
		paddingTop: theme.padding.base,
		color: theme.colors.success,
	},
	tableContainer: {
		marginHorizontal: theme.padding.base,
		backgroundColor: theme.colors.black,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	tableWrapper: {
		marginTop: theme.margins.base,
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	shiftText: {
		alignSelf: 'flex-end',
		marginLeft: -theme.padding.xs,
	},
	viewMoreText: {
		textDecorationLine: 'underline',
	},
}));
