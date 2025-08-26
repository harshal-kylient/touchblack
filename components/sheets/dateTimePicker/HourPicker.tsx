import { Button, Text } from '@touchblack/ui';
import { darkTheme } from '@touchblack/ui/theme';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { FlatList, TouchableOpacity, View, ViewToken, Dimensions } from 'react-native';

export default function CustomHourPicker({ value, label = 'Hour', onSelect, min = 0, max = 24, successText = 'Set', dismissText = 'Cancel', onDismiss, maxElementsAtATime }: { onSelect: (selected: { hour: string }) => void; maxElementsAtATime?: number; onDismiss: () => void; successText?: string; dismissText?: string; min?: number; max?: number; label?: string; value?: string }) {
	const today = moment();
	const width = Dimensions.get('window').width;
	const [hour, setHour] = useState(String(today.hour()).padStart(2, '0'));
	const [elementHeight, setElementHeight] = useState(40);
	const hoursRef = useRef<FlatList>(null);

	useEffect(() => {
		if (value) {
			setHour(value);

			setTimeout(() => {
				hoursRef.current?.scrollToItem({ item: value, animated: true, viewPosition: 0.5 });
			}, 100);
		} else {
			setHour(String(Math.max(today.hour(), min)).padStart(2, '0'));

			setTimeout(() => {
				hoursRef.current?.scrollToItem({ item: String(Math.max(today.hour(), min)).padStart(2, '0'), animated: true, viewPosition: 0.5 });
			}, 100);
		}
	}, [hoursRef.current]);

	const extraElements = 2;
	const hours = [...Array(extraElements).fill(null), ...Array.from({ length: max - min }, (_, i) => String(i + min).padStart(2, '0')), ...Array(extraElements).fill(null)];

	const handleViewableItemsChanged =
		(setData: (value: any) => void) =>
		({ viewableItems }: { viewableItems: ViewToken[] }) => {
			if (viewableItems.length > 0) {
				const centerIndex = Math.floor(viewableItems.length / 2);
				const centerItem = viewableItems[centerIndex]?.item;
				if (centerItem != null) setData(centerItem);
			}
		};

	const getItemLayout = (_: any, index: number) => ({
		length: elementHeight,
		offset: elementHeight * index,
		index,
	});

	const renderHourItem = ({ item, index }: { item: number | null; index: number }) => {
		if (item == null) return <View style={{ height: elementHeight }} />;
		return (
			<TouchableOpacity
				style={{
					height: elementHeight,
					justifyContent: 'center',
					alignItems: 'center',
					borderRadius: 12,
					flexDirection: 'row',
					transform: [
						{
							perspective: 500,
						},
						{
							rotateX: String(hour) === String(item) ? '0deg' : '20deg',
						},
					],
					backgroundColor: String(hour) === String(item) ? '#2C2A30' : 'transparent',
				}}
				onPress={() => hoursRef.current?.scrollToIndex({ index, viewPosition: 0.5 })}>
				<Text size="button" color={String(hour) === String(item) ? 'regular' : 'muted'}>
					{item}
				</Text>
				<Text size="button" color={String(hour) === String(item) ? 'regular' : 'muted'}>
					{' : 00'}
				</Text>
			</TouchableOpacity>
		);
	};

	return (
		<View style={{ backgroundColor: darkTheme.colors.black }}>
			<View style={{ marginVertical: 8, flexDirection: 'row', paddingHorizontal: 36, justifyContent: 'center' }}>
				<Text size="button" color="regular">
					{label}
				</Text>
			</View>
			<View style={{ maxHeight: elementHeight * 5, gap: 12, paddingHorizontal: width / 3, borderTopWidth: 1, borderColor: darkTheme.colors.borderGray, flexDirection: 'row', justifyContent: 'center' }}>
				<FlatList ref={hoursRef} data={hours} getItemLayout={getItemLayout} keyExtractor={(_, i) => `hour-${i}`} renderItem={renderHourItem} onViewableItemsChanged={handleViewableItemsChanged(setHour)} viewabilityConfig={{ itemVisiblePercentThreshold: 50 }} snapToInterval={elementHeight} decelerationRate="fast" showsVerticalScrollIndicator={false} />
			</View>
			<View style={{ borderTopWidth: darkTheme.borderWidth.bold, paddingTop: darkTheme.padding.base, borderColor: darkTheme.colors.borderGray, paddingHorizontal: darkTheme.padding.base, flexDirection: 'row', minWidth: '100%' }}>
				<Button onPress={onDismiss} type="secondary" textColor="regular" style={{ flex: 1, borderWidth: darkTheme.borderWidth.slim, borderColor: darkTheme.colors.borderGray }}>
					{dismissText}
				</Button>
				<Button onPress={() => onSelect({ hour: hour + ':00' })} style={{ flex: 1, borderWidth: darkTheme.borderWidth.slim, borderColor: darkTheme.colors.borderGray }}>
					{successText}
				</Button>
			</View>
		</View>
	);
}
