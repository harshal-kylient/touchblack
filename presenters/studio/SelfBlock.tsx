import { useCallback, useMemo, useState } from 'react';
import { Pressable, SafeAreaView, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useNavigation } from '@react-navigation/native';

import { Button, Text } from '@touchblack/ui';
import { FlashList } from '@shopify/flash-list';

import NoSelfBlock from '@components/errors/NoSelfBlock';
import Header from '@components/Header';
import SearchInput from '@components/SearchInput';
import useGetStudioFloorBlockedDates from '@network/useGetStudioFloorBlockedDates';
import { useStudioContext } from './StudioContext';
import CONSTANTS from '@constants/constants';
import { useAuth } from '@presenters/auth/AuthContext';
import EnumStudioStatus from '@models/enums/EnumStudioStatus';

interface Item {
	end_date: string;
	end_time: string;
	notes: string;
	reason_type: string;
	start_date: string;
	start_time: string;
	title: string;
}

function SelfBlock() {
	const navigation = useNavigation();
	const { studioFloor } = useStudioContext();
	const { styles, theme } = useStyles(stylesheet);
	const { data: response } = useGetStudioFloorBlockedDates(studioFloor?.id || '');
	const [searchQuery, setSearchQuery] = useState<string>('');
	const { permissions } = useAuth();

	const handleSelfBlock = (item?: Item) => {
		navigation.navigate('StudioBlackoutDates', {
			floorId: studioFloor?.id || '',
			item: item || undefined,
		});
	};

	const filteredData = response?.data.filter((item: Item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()));

	const memoizedIconContainerStyle = useMemo(() => {
		return (index: number, listLength: number, status: EnumStudioStatus) => {
			const color = status === EnumStudioStatus.Confirmed ? theme.colors.destructive : status === EnumStudioStatus.Completed ? theme.colors.verifiedBlue : status === EnumStudioStatus.Tentative ? theme.colors.primary : status === EnumStudioStatus.Enquiry ? theme.colors.success : status === EnumStudioStatus['Not available'] ? '#555' : theme.colors.muted;
			return styles.iconContainer(index, listLength, color, 60);
		};
	}, [theme, styles]);

	const formatDateTime = (date: string, time: string) => {
		return `${date} ${time}`;
	};

	const renderItem = useCallback(
		({ item, index }: { item: Item; index: number }) => {
			const listLength = filteredData?.length || 1;
			const status = item?.blocked_project_status;

			return (
				<Pressable style={styles.iContainer} onPress={permissions?.includes('Calendar::Edit') ? () => handleSelfBlock(item) : () => {}}>
					<View style={styles.borderContainer}>
						<View style={memoizedIconContainerStyle(index, listLength, status)} />
						<View style={{ gap: 8 }}>
							<Text size="bodyBig" color="regular" style={{ maxWidth: '95%' }} numberOfLines={1}>
								{item.title}
							</Text>
							<Text size="bodyMid" color="regular">
								{item.start_date} - {item.end_date}
							</Text>
						</View>
					</View>
				</Pressable>
			);
		},
		[filteredData, styles, handleSelfBlock],
	);

	return (
		<SafeAreaView style={styles.container}>
			<Header name="Self Block" />
			<SearchInput placeholderText="Search by title" searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
			<FlashList
				data={filteredData || []}
				renderItem={renderItem}
				estimatedItemSize={60}
				ListEmptyComponent={
					<View style={{ flex: 1, zIndex: -9, height: (6.5 * CONSTANTS.screenHeight) / 10, justifyContent: 'center' }}>
						<NoSelfBlock />
					</View>
				}
			/>
			{permissions?.includes('Calendar::Edit') && (
				<View style={styles.footer}>
					<Button type="inline" textColor="primary" style={styles.button} onPress={() => handleSelfBlock()}>
						Self Block
					</Button>
				</View>
			)}
		</SafeAreaView>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
	footer: {
		padding: theme.padding.base,
		borderTopWidth: theme.borderWidth.slim,
		borderTopColor: theme.colors.borderGray,
	},
	button: {
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.primary,
	},
	borderContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
		gap: theme.gap.base,
		marginHorizontal: theme.margins.base,
		borderColor: theme.colors.borderGray,
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
	},
	iconContainer: (index: number, listLength: number = 1, color: string, height: number) => {
		// Ensure listLength is at least 1 to avoid division by zero
		listLength = Math.max(1, listLength);

		// Calculate opacity using a logarithmic scale
		const baseOpacity = 0.2; // Minimum opacity
		const opacityRange = 0.8; // Range of opacity (0.2 to 1.0)
		const opacity = baseOpacity + opacityRange * (1 - Math.log(index + 1) / Math.log(listLength));

		// Ensure opacity is between 0 and 1
		const clampedOpacity = Math.min(1, Math.max(0, opacity));

		// Parse the color to get its RGB components
		const rgbMatch = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
		if (rgbMatch) {
			const [, r, g, b] = rgbMatch.map(Number);
			return {
				width: 8,
				height: height,
				backgroundColor: `rgba(${r}, ${g}, ${b}, ${clampedOpacity.toFixed(2)})`,
			};
		} else {
			// Fallback if color parsing fails
			return {
				width: 8,
				height: height,
				backgroundColor: color,
				opacity: 1,
			};
		}
	},
	iContainer: {
		height: 60,
		borderColor: theme.colors.borderGray,
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
	},
}));

export default SelfBlock;
