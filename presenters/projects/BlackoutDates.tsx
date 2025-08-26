// Updated BlackoutDates component with menu modal (similar to TalentThumbnailCard)
import { memo, useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, SafeAreaView, View, TouchableOpacity, Modal } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { SheetManager } from 'react-native-actions-sheet';
import { Button, Text } from '@touchblack/ui';
import { Close, Delete, Menu } from '@touchblack/icons';
import { FlashList } from '@shopify/flash-list';
import { format, parseISO } from 'date-fns';
import Header from '@components/Header';
import { SheetType } from 'sheets';
import useGetBlackoutDates from '@network/useGetBlackoutDates';
import capitalized from '@utils/capitalized';
import EnumStatus from '@models/enums/EnumStatus';
import { useNavigation } from '@react-navigation/native';

export type BlockedDateRange = {
	id: string;
	startDate: string;
	endDate: string;
	notes?: string;
	title?: string;
	project_name?: string;
	blocked_reason_type?: string;
	blocked_project_status?: {
		id: string;
		name: string;
	} | null;
};

const BlackoutDates = memo(() => {
	const { styles, theme } = useStyles(stylesheet);
	const { data: response } = useGetBlackoutDates(String(new Date().getFullYear()));
	const data = response?.data;
	const navigation = useNavigation();
	const [modalVisible, setModalVisible] = useState(false);
	const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
	const [selectedItem, setSelectedItem] = useState<BlockedDateRange | null>(null);
	const menuButtonRef = useRef<TouchableOpacity>(null);

	const blockedDateRanges: BlockedDateRange[] = useMemo(() => {
		if (!data) return [];
		return data.map((it, index) => ({
			id: `${index}`,
			startDate: it?.start_date,
			endDate: it?.end_date,
			startTime: it?.start_time,
			endTime: it?.end_time,
			notes: it?.notes,
			title: it?.title,
			project_name: it?.title,
			blocked_reason_type: it?.blocked_reason_type,
			blocked_project_status: it?.blocked_project_status
				? {
						id: capitalized(it?.blocked_project_status),
						name: capitalized(it?.blocked_project_status),
				  }
				: null,
		}));
	}, [data]);

	const handleMenuPress = (item: BlockedDateRange, ref: any) => {
		if (ref?.current) {
			ref.current.measure((x, y, width, height, pageX, pageY) => {
				setMenuPosition({ x: pageX - 100, y: pageY + height });
				setSelectedItem(item);
				setModalVisible(true);
			});
		}
	};

	const handleCancelBlackout = () => {
		if (!selectedItem) return;
		SheetManager.show('Drawer', {
			payload: {
				sheet: SheetType.CancelBlackout,
				data: {
					startTime: selectedItem.startTime,
					endTime: selectedItem.endTime,
					startDate: selectedItem.startDate,
					endDate: selectedItem.endDate,
					notes: selectedItem.notes,
					title: selectedItem.title || selectedItem.project_name,
					reason: selectedItem.blocked_reason_type,
				},
			},
		});
		setModalVisible(false);
	};

	const handleAddBlackout = useCallback(
		(existingData?: BlockedDateRange) => {
			navigation.navigate('BlockTalentDates', { payload: { blockedDateRanges, existingData } });
		},
		[blockedDateRanges],
	);

	const renderBlockedDateRange = ({ item, index }: { item: BlockedDateRange; index: number }) => {
		const formattedStartDate = format(parseISO(item.startDate), 'dd/MM');
		const formattedEndDate = format(parseISO(item.endDate), 'dd/MM');
		const getBorderColor = (status?: string | null) => {
			switch (status?.toLowerCase()) {
				case 'confirmed':
					return theme.colors.destructive
				case 'tentative':
					return theme.colors.primary
				case 'enquiry':
					return theme.colors.success
				case 'blackout':
					return theme.colors.muted
				default:
					return 'transparent';
			}
		};

		const borderColor = getBorderColor(item?.blocked_project_status?.name);
	

		return (
			<View style={styles.blockedDateItem(index)}>
				<TouchableOpacity style={{ width: '80%' }} onPress={() => handleAddBlackout(item)}>
					<View style={styles.dateInfoContainer(borderColor)}>
						<Text size="secondary" color="regular">
							{item?.title || item?.project_name}
						</Text>
						<Text size="bodyMid" color="regular">
							{formattedStartDate} - {formattedEndDate}
						</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity ref={menuButtonRef} onPress={() => handleMenuPress(item, menuButtonRef)}>
					<Menu size={24} color={theme.colors.primary} />
				</TouchableOpacity>
			</View>
		);
	};

	return (
		<SafeAreaView style={styles.container}>
			<Header name="Self block" />
			<View style={styles.body}>
				<FlashList
					data={blockedDateRanges}
					renderItem={renderBlockedDateRange}
					estimatedItemSize={60}
					ListEmptyComponent={
						<View style={{ alignItems: 'center', justifyContent: 'center' }}>
							<Text color="muted" size="button">
								No Self block Dates
							</Text>
						</View>
					}
				/>
			</View>
			<View style={styles.buttonContainer}>
				<Button type="secondary" textColor="primary" onPress={handleAddBlackout} style={styles.button}>
					Self block
				</Button>
			</View>

			<Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
				<TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalVisible(false)}>
					<View
						style={[
							styles.modalContent,
							{
								position: 'absolute',
								left: menuPosition.x,
								top: menuPosition.y,
							},
						]}>
						
						<TouchableOpacity style={styles.menuItem} onPress={handleCancelBlackout}>
							<Delete size="22" color={theme.colors.destructive} />
							<Text size="bodyMid" color="error" style={{ marginLeft: 8 }}>
								Remove
							</Text>
						</TouchableOpacity>
					</View>
				</TouchableOpacity>
			</Modal>
		</SafeAreaView>
	);
});

const stylesheet = createStyleSheet(theme => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
	body: {
		flex: 1,
		marginTop: theme.margins.xxl,
	},
	blockedDateItem: index => ({
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: theme.colors.backgroundDarkBlack,
		borderTopWidth: index === 0 ? theme.borderWidth.slim : 0,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		paddingHorizontal: theme.padding.base,
	}),
	dateInfoContainer: (borderColor: string) => ({
		paddingVertical: theme.padding.sm,
		paddingLeft: theme.padding.base,
		borderLeftWidth: 10,
		borderLeftColor: borderColor,
	}),
	buttonContainer: {
		width: '100%',
		borderColor: theme.colors.borderGray,
		borderTopWidth: theme.borderWidth.slim,
	},
	button: {
		flexGrow: 1,
		marginTop: theme.padding.xs,
		marginHorizontal: theme.margins.base,
		marginBottom: theme.margins.xxxl,
		borderColor: theme.colors.primary,
		borderWidth: theme.borderWidth.slim,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	modalContent: {
		backgroundColor: theme.colors.backgroundLightBlack,
		paddingVertical: 8,
		paddingHorizontal: 12,
	},
	menuItem: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: theme.padding.xxs,
	},
}));

export default BlackoutDates;
