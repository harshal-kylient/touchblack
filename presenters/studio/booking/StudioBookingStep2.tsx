import Header from '@components/Header';
import SearchInput from '@components/SearchInput';
import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { Button, Text } from '@touchblack/ui';
import { useState } from 'react';
import { View, SafeAreaView, Pressable, RefreshControl } from 'react-native';
import { useStyles } from 'react-native-unistyles';
import StudioCard from './StudioCard';
import StudioStepsIndicator from './StepsIndicator';
import { useStudioBookingContext } from './StudioContext';
import { formatDates } from '@utils/formatDates';
import useGetAllStudioFloors from '@network/useGetAllStudioFloors';
import moment from 'moment';
import CONSTANTS from '@constants/constants';

function studioFilterTransformer(data) {
	const filter: any = {};
	let transformed = '';

	if (data?.city_id) {
		filter.city_id = data.city_id?.id;
	}
	if (data?.catwalk === true || data?.catwalk === false) {
		filter.catwalk = data.catwalk;
	}
	if (data?.is_soundproof === true || data?.is_soundproof === false) {
		filter.is_soundproof = data.is_soundproof;
	}
	if (data?.is_air_conditioned === true || data?.is_air_conditioned === false) {
		filter.is_air_conditioned = data.is_air_conditioned;
	}
	if (data?.generator_backup === true || data?.generator_backup === false) {
		filter.generator_backup = data.generator_backup;
	}
	if (data?.studio_floor_area?.[0] > CONSTANTS.MIN_STUDIO_AREA || data?.studio_floor_area?.[1] < CONSTANTS.MAX_STUDIO_AREA) {
		filter.studio_floor_area = JSON.stringify(data.studio_floor_area);
	}
	if (data?.studio_charges_per_shift?.[0] > CONSTANTS.MIN_STUDIO_RATE || data?.studio_charges_per_shift?.[1] < CONSTANTS.MAX_STUDIO_RATE) {
		filter.studio_charges_per_shift = JSON.stringify(data.studio_charges_per_shift);
	}
	if (data?.advance_booking_amount?.[0] > CONSTANTS.MIN_STUDIO_RATE || data?.advance_booking_amount?.[1] < CONSTANTS.MAX_STUDIO_RATE) {
		filter.advance_booking_amount = JSON.stringify(data.advance_booking_amount);
	}

	const entries = Object.entries(filter);

	for (let i = 0; i < entries.length; i++) {
		const [key, value] = entries[i];
		transformed += `${key}=${value}`;

		if (i < entries.length - 1) {
			transformed += '&';
		}
	}
	return transformed;
}

export default function StudioBookingStep2({ route }) {
	const { styles, theme } = useStyles();
	const [query, setQuery] = useState('');
	const [serverError, setServerError] = useState('');
	const { state } = useStudioBookingContext();
	const filters = studioFilterTransformer(state.filters);
	const { data, isLoading, isFetching, hasNextPage, fetchNextPage, refetch } = useGetAllStudioFloors(
		query,
		state.dates?.map(it => moment(it, 'YYYY-MM-DD').format('YYYY-MM-DD')),
		state.full_day ? '00:00' : state.from_time,
		state.full_day ? '23:59' : state.to_time,
		filters,
	);
	const selectedIds = Array.isArray(state.studio_floor) ? state.studio_floor.filter(it => it?.id).map(it => it.id) : [];

	const filteredData = Array.isArray(data)
		? [...data].sort((a, b) => {
				const aSelected = selectedIds.includes(a?.id);
				const bSelected = selectedIds.includes(b?.id);
				if (aSelected && !bSelected) return -1;
				if (!aSelected && bSelected) return 1;
				return 0;
		  })
		: [];

	const navigation = useNavigation();
	const city = state.filters.city_id;
	const time = state.full_day ? 'Full day' : `${moment(state.from_time, 'HH:mm').format('hh:mm A')} - ${moment(state.to_time, 'HH:mm').format('hh:mm A')}`;
	const dates = formatDates(state.dates);

	function handleFilterPress() {
		navigation.navigate('StudioFilter');
	}

	function handleSubmit() {
		if (!state.studio_floor?.length) {
			setServerError('Studio selection is required');
			return;
		}
		navigation.navigate('StudioBookingStep3');
	}

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.backgroundDarkBlack }}>
			<Header name="Select Studios" />
			<StudioStepsIndicator step={1} />
			<View style={{ flexDirection: 'row', gap: 0, minWidth: '100%', paddingRight: theme.padding.base }}>
				<SearchInput containerStyles={{ paddingRight: 0, flex: 1 }} searchQuery={query} setSearchQuery={setQuery} placeholderText="Search Studios" />
				{/*<Pressable
					onPress={handleFilterPress}
					style={{
						backgroundColor: theme.colors.backgroundLightBlack,
						paddingHorizontal: theme.margins.base,
						marginVertical: theme.margins.base,
						justifyContent: 'center',
						alignItems: 'center',
						borderWidth: theme.borderWidth.slim,
						borderColor: theme.colors.borderGray,
						borderLeftWidth: 0,
					}}>
					<Filter color={filters ? theme.colors.primary : theme.colors.typography} size="20" />
					{filters ? <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.primary, position: 'absolute', top: 12, right: 12 }}></View> : null}
				</Pressable>*/}
			</View>
			<View style={{ borderBottomWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, paddingHorizontal: theme.padding.base, paddingVertical: theme.padding.base }}>
				<Text size="bodyMid" color="muted">
					Below are the results
					{Boolean(city?.name) && ' for '}
					<Text size="bodyMid" color="primary">
						{city?.name}
					</Text>
					{Boolean(city?.name) && ' city '} on{' '}
					<Text size="bodyMid" color="primary">
						{dates}
					</Text>
					.
				</Text>
			</View>
			<View style={{ flex: 1 }}>
				<FlashList
					estimatedItemSize={131}
					data={filteredData}
					contentContainerStyle={{ paddingBottom: 80 }}
					renderItem={({ item }) => <StudioCard id={item?.id} item={item} />}
					refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
					onEndReached={() => {
						if (!isLoading && hasNextPage) {
							fetchNextPage();
						}
					}}
					onEndReachedThreshold={0.5}
					keyExtractor={(item, index) => String(index)}
					ListEmptyComponent={
						<View style={{ paddingHorizontal: theme.padding.base, paddingVertical: theme.padding.base, justifyContent: 'center', alignItems: 'center' }}>
							<Text size="button" color="muted">
								No Studios Found
							</Text>
						</View>
					}
				/>
			</View>
			<View style={{ flex: 1, backgroundColor: theme.colors.backgroundDarkBlack, paddingTop: theme.padding.base, paddingBottom: 2 * theme.padding.base, borderTopWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, position: 'absolute', bottom: 0, minWidth: '100%' }}>
				{serverError ? (
					<Pressable onPress={() => setServerError('')} style={{ paddingHorizontal: theme.padding.base, flex: 1, paddingBottom: theme.padding.xs, marginBottom: theme.margins.xxs, borderBottomWidth: 1, borderColor: theme.colors.borderGray }}>
						<Text size="bodyMid" textAlign="center" color="error">
							{serverError}
						</Text>
					</Pressable>
				) : null}
				<View style={{ paddingHorizontal: theme.padding.base }}>
					<Button onPress={handleSubmit}>Review</Button>
				</View>
			</View>
		</SafeAreaView>
	);
}
