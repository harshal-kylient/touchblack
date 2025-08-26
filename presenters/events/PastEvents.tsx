import React, { useMemo, useRef } from 'react';
import { ActivityIndicator, Image, Pressable, SafeAreaView, SectionList, Text, TouchableOpacity, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Text as TextUi } from '@touchblack/ui';
import { useNavigation } from '@react-navigation/native';
import useGetAllEvents from '@network/useAllGetEvents';
import NoLikedFilms from '@components/errors/NoLikedFilms';
import CONSTANTS from '@constants/constants';

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function PastEventsList() {
	const { styles, theme } = useStyles(stylesheet);
	const navigation = useNavigation();
	const { data: response, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetAllEvents(true);

	const events = response?.pages.flatMap(page => page?.data?.events ?? []) || [];

	const onEndReachedCalledDuringMomentum = useRef(false);

	const sectionedEvents = useMemo(() => {
		const sections = {};

		events.forEach(event => {
			const date = new Date(event.event_date);
			const monthYear = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
			if (!sections[monthYear]) sections[monthYear] = [];
			sections[monthYear].push(event);
		});

		return Object.keys(sections)
			.sort((a, b) => {
				const dateA = new Date(sections[a][0].event_date);
				const dateB = new Date(sections[b][0].event_date);
				return dateB - dateA;
			})
			.map(key => ({
				title: key,
				data: sections[key].sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime()), // Reversed: b - a instead of a - b
			}));
	}, [events]);

	const renderEventItem = ({ item, index }) => {
		const date = new Date(item.event_date);
		return (
			<TouchableOpacity onPress={() => navigation.navigate('EventDetails', { event_id: item.id, past_event:true })}>
				<View style={styles.eventItem(index)}>
					<View style={styles.eventDate}>
						<Text style={styles.eventDay}>{date.getDate()}</Text>
						<Text style={styles.eventMonth}>{monthNames[date.getMonth()].slice(0, 3)}</Text>
					</View>
					<Image source={item?.poster_url ? { uri: item?.poster_url } : require('../../assets/images/loadingImage.png')} style={styles.eventImage} />
					<View style={styles.eventTitleView}>
						<TextUi color="regular" size="bodyBig" numberOfLines={1}>
							{item.title}
						</TextUi>
						<TextUi color="muted" size="bodyMid" numberOfLines={1}>
							{item.city}
						</TextUi>
					</View>
				</View>
			</TouchableOpacity>
		);
	};

	const renderFooter = () => {
		if (!isFetchingNextPage) return null;
		return (
			<View style={{ paddingVertical: 16 }}>
				<ActivityIndicator size="small" color={theme.colors.primary} />
			</View>
		);
	};

	if (isLoading) {
		return (
			<SafeAreaView style={styles.container}>
				<ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 20 }} />
			</SafeAreaView>
		);
	}

	if (isError) {
		return (
			<SafeAreaView style={styles.container}>
				<Text
					style={{
						color: theme.colors.muted,
						marginTop: 20,
						textAlign: 'center',
					}}>
					Failed to load events.
				</Text>
			</SafeAreaView>
		);
	}

	return (
		<View style={styles.container}>
			<SectionList
				sections={sectionedEvents}
				keyExtractor={item => item.id}
				renderSectionHeader={({ section: { title } }) => (
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionHeaderText}>{title}</Text>
					</View>
				)}
				renderItem={renderEventItem}
				ListEmptyComponent={
					<View
						style={{
							flex: 1,
							height: (5 * CONSTANTS.screenHeight) / 10,
							justifyContent: 'center',
						}}>
						<NoLikedFilms title="No Results" desc={'No Events found for the current query'} />
					</View>
				}
				onEndReached={() => {
					if (hasNextPage && !isFetchingNextPage && !onEndReachedCalledDuringMomentum.current) {
						fetchNextPage();
						onEndReachedCalledDuringMomentum.current = true;
					}
				}}
				onMomentumScrollBegin={() => {
					onEndReachedCalledDuringMomentum.current = false;
				}}
				onEndReachedThreshold={0.5}
				ListFooterComponent={renderFooter}
			/>
		</View>
	);
}

export default PastEventsList;

const stylesheet = createStyleSheet(theme => ({
	container: {
		flex: 1,
		marginTop: theme.padding.base,
		backgroundColor: theme.colors.black,
	},
	sectionHeader: {
		backgroundColor: theme.colors.backgroundLightBlack,
		padding: theme.padding.base,
		paddingVertical: theme.padding.sm * 1.25,
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	sectionHeaderText: {
		color: theme.colors.typography,
		fontSize: 20,
	},
	eventItem: index => ({
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: theme.padding.base,
		borderBottomColor: theme.colors.borderGray,
		borderBottomWidth: theme.borderWidth.slim,
		...(index === 0 && {
			borderTopColor: theme.colors.borderGray,
			borderTopWidth: theme.borderWidth.slim,
		}),
	}),
	eventDate: {
		width: 64,
		height: 64,
		padding: theme.padding.sm,
		alignItems: 'center',
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	eventDay: {
		color: theme.colors.typography,
		fontSize: theme.fontSize.primaryH3,
		fontWeight: theme.fontWeight.medium,
	},
	eventMonth: {
		color: theme.colors.typography,
		fontSize: theme.fontSize.typographySm,
	},
	eventImage: {
		width: 64,
		height: 64,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	eventTitleView: {
		flex: 1,
		height: 64,
		paddingHorizontal: theme.padding.sm,
		alignItems: 'flex-start',
		justifyContent: 'center',
		borderColor: theme.colors.borderGray,
	},
}));
