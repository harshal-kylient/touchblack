import { Button, Text } from '@touchblack/ui';
import { darkTheme } from '@touchblack/ui/theme';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { FlatList, TouchableOpacity, View, ViewToken } from 'react-native';

function padStartWith0(entity: number | string, size: number = 2) {
	return String(entity).padStart(size, '0');
}

export function transform(value: string) {
	if (!value) return;
	const arr = value.split('-');
	const date = arr[2];
	const month = arr[1];
	const year = arr[0];

	return { date, month, year };
}

export default function CustomDatePicker({ value, onSelect, successText = 'Set', dismissText = 'Cancel', onDismiss, maxElementsAtATime }: { value: { date: string; month: string; year: string } | undefined; onSelect: (selected: { date: string; month: string; monthName: string; year: string }) => void; maxElementsAtATime?: number; onDismiss: () => void; successText?: string; dismissText?: string }) {
	const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	const today = moment();
	const [date, setDate] = useState(padStartWith0(today.date()));
	const [month, setMonth] = useState(MONTHS[today.month()]);
	const [year, setYear] = useState(+today.year());
	const [elementHeight, setElementHeight] = useState(40);
	const [yearElementHeight, setYearElementHeight] = useState(40);
	const datesRef = useRef<FlatList>(null);
	const monthsRef = useRef<FlatList>(null);
	const yearsRef = useRef<FlatList>(null);

	useEffect(() => {
		if (value?.date && value?.month && value?.year) {
			const dateValue = padStartWith0(value.date);
			const monthValue = MONTHS[Number(value.month) - 1];
			const yearValue = Number(value.year);
			setDate(dateValue);
			setMonth(monthValue);
			setYear(yearValue);

			setTimeout(() => {
				datesRef.current?.scrollToItem({ item: dateValue, animated: true, viewPosition: 0.5 });
				monthsRef.current?.scrollToItem({ item: monthValue, animated: true, viewPosition: 0.5 });
				yearsRef.current?.scrollToItem({ item: yearValue, animated: true, viewPosition: 0.5, viewOffset: 2 });
			}, 100);
		} else {
			setDate(padStartWith0(today.date()));
			setMonth(MONTHS[today.month()]);
			setYear(+today.year());

			setTimeout(() => {
				datesRef.current?.scrollToItem({ item: padStartWith0(today.date()), animated: true, viewPosition: 0.5 });
				monthsRef.current?.scrollToItem({ item: MONTHS[today.month()], animated: true, viewPosition: 0.5 });
				yearsRef.current?.scrollToItem({ item: +today.year(), animated: true, viewPosition: 0.5, viewOffset: 2 });
			}, 100);
		}
	}, [datesRef.current, yearsRef.current]);

	const isLeapYearFeb = month === 'February' && +year % 4 === 0;
	const isFeb = month === 'February';
	const is31Month = month === 'January' || month === 'March' || month === 'May' || month === 'July' || month === 'August' || month === 'October' || month === 'December';

	const extraElements = 2;
	const dates = [...Array(extraElements).fill(null), ...Array.from({ length: isLeapYearFeb ? 29 : isFeb ? 28 : is31Month ? 31 : 30 }, (_, i) => padStartWith0(i + 1)), ...Array(extraElements).fill(null)];
	const months = [...Array(extraElements).fill(null), ...MONTHS, ...Array(extraElements).fill(null)];
	const currentYear = new Date().getFullYear() - 25;
	const years = [...Array(extraElements).fill(null), ...Array.from({ length: 50 }, (_, i) => currentYear + i), ...Array(extraElements).fill(null)];

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

	const renderDateItem = ({ item, index }: { item: string | null; index: number }) => {
		if (item == null) return <View style={{ height: elementHeight }} />;
		return (
			<TouchableOpacity
				style={{
					height: elementHeight,
					justifyContent: 'center',
					alignItems: 'center',
					borderRadius: 12,
					transform: [
						{
							perspective: 500,
						},
						{
							rotateX: date === item ? '0deg' : '20deg',
						},
					],
					backgroundColor: date === item ? '#2C2A30' : 'transparent',
				}}
				onPress={() => datesRef.current?.scrollToIndex({ index, viewPosition: 0.5 })}>
				<Text size="button" color={date === item ? 'regular' : 'muted'}>
					{item}
				</Text>
			</TouchableOpacity>
		);
	};

	// Similar render functions for months and years
	const renderMonthItem = ({ item, index }: { item: string | null; index: number }) => {
		if (item == null) return <View style={{ height: elementHeight }} />;
		return (
			<TouchableOpacity
				style={{
					height: elementHeight,
					justifyContent: 'center',
					alignItems: 'center',
					borderRadius: 12,
					transform: [
						{
							perspective: 500,
						},
						{
							rotateX: month === item ? '0deg' : '20deg',
						},
					],
					backgroundColor: month === item ? '#2C2A30' : 'transparent',
				}}
				onPress={() => monthsRef.current?.scrollToIndex({ index, viewPosition: 0.5 })}>
				<Text size="button" color={month === item ? 'regular' : 'muted'}>
					{item}
				</Text>
			</TouchableOpacity>
		);
	};

	const renderYearItem = ({ item, index }: { item: number | null; index: number }) => {
		if (item == null) return <View style={{ height: yearElementHeight }} />;
		return (
			<TouchableOpacity
				style={{
					height: elementHeight,
					justifyContent: 'center',
					alignItems: 'center',
					borderRadius: 12,
					transform: [
						{
							perspective: 500,
						},
						{
							rotateX: year === item ? '0deg' : '20deg',
						},
					],
					backgroundColor: year === item ? '#2C2A30' : 'transparent',
				}}
				onPress={() => yearsRef.current?.scrollToIndex({ index, viewPosition: 0.5 })}>
				<Text size="button" color={year === item ? 'regular' : 'muted'}>
					{item}
				</Text>
			</TouchableOpacity>
		);
	};

	return (
		<View style={{ backgroundColor: darkTheme.colors.black }}>
			<View style={{ marginVertical: 8, flexDirection: 'row', paddingHorizontal: 36, justifyContent: 'space-between' }}>
				<Text size="button" color="regular">
					Day
				</Text>
				<Text size="button" color="regular">
					Month
				</Text>
				<Text size="button" color="regular">
					Year
				</Text>
			</View>
			<View style={{ maxHeight: elementHeight * 5, gap: 12, paddingHorizontal: 12, borderTopWidth: 1, borderColor: darkTheme.colors.borderGray, flexDirection: 'row', justifyContent: 'center' }}>
				<FlatList ref={datesRef} data={dates} getItemLayout={getItemLayout} keyExtractor={(_, i) => `date-${i}`} renderItem={renderDateItem} onViewableItemsChanged={handleViewableItemsChanged(setDate)} viewabilityConfig={{ itemVisiblePercentThreshold: 50 }} snapToInterval={elementHeight} decelerationRate="fast" showsVerticalScrollIndicator={false} />

				<FlatList ref={monthsRef} data={months} getItemLayout={getItemLayout} keyExtractor={(_, i) => `month-${i}`} renderItem={renderMonthItem} onViewableItemsChanged={handleViewableItemsChanged(setMonth)} viewabilityConfig={{ itemVisiblePercentThreshold: 50 }} snapToInterval={elementHeight} decelerationRate="fast" showsVerticalScrollIndicator={false} />

				<FlatList
					ref={yearsRef}
					data={years}
					getItemLayout={(_, index) => ({
						length: yearElementHeight,
						offset: yearElementHeight * index,
						index,
					})}
					keyExtractor={(_, i) => `year-${i}`}
					renderItem={renderYearItem}
					onViewableItemsChanged={handleViewableItemsChanged(setYear)}
					viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
					snapToInterval={yearElementHeight}
					decelerationRate="fast"
					showsVerticalScrollIndicator={false}
				/>
			</View>
			<View style={{ borderTopWidth: darkTheme.borderWidth.bold, paddingTop: darkTheme.padding.base, borderColor: darkTheme.colors.borderGray, paddingHorizontal: darkTheme.padding.base, flexDirection: 'row', minWidth: '100%' }}>
				<Button onPress={onDismiss} type="secondary" textColor="regular" style={{ flex: 1, borderWidth: darkTheme.borderWidth.slim, borderColor: darkTheme.colors.borderGray }}>
					{dismissText}
				</Button>
				<Button onPress={() => onSelect({ date: String(date), month: padStartWith0(MONTHS.findIndex(it => it === month) + 1), monthName: month, year: String(year) })} style={{ flex: 1, borderWidth: darkTheme.borderWidth.slim, borderColor: darkTheme.colors.borderGray }}>
					{successText}
				</Button>
			</View>
		</View>
	);
}
