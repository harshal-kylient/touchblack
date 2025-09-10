import { Button } from '@touchblack/ui';
import { View, Text, StatusBar, Image, Pressable, Platform, ActivityIndicator, ScrollView, SafeAreaView } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Bookmark, LongArrowRight, Person } from '@touchblack/icons';

import VideoPlayer from '@components/VideoPlayer';
import createAbsoluteImageUri from '@utils/createAbsoluteImageUri';
import capitalized from '@utils/capitalized';
import UserItem from '@components/UserItem';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { IMainStackParams } from '..';
import SearchInput from '@components/SearchInput';
import { useNavigation } from '@react-navigation/native';
import VideoPlayerHeader from './VideoPlayerHeader';
import truncate from '@utils/truncate';
import useGetCrewList from '@network/useGetCrewList';
import { FlashList } from '@shopify/flash-list';
import { useEffect, useState } from 'react';
import Animated, { useAnimatedKeyboard, useAnimatedStyle } from 'react-native-reanimated';
import useGetFilmDetails from '@network/useGetFilmDetails';
import VideoPlayerPlaceholder from '@components/loaders/VideoPlayerPlaceholder';
import extractVideoInfo from '@utils/extractVideoInfo';

type IProps = NativeStackScreenProps<IMainStackParams, 'VideoPlayer'>;

function VideoPlayerScreen({ route }: IProps) {
	const id = route.params?.id;
	const { data: film } = useGetFilmDetails(id!);
	const [query, setQuery] = useState('');
	const { data: response, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetCrewList(id);
	const crewCount = response?.pages[0]?.data?.count || 0;
	const crewlist = response?.pages?.flatMap(page => page?.data?.results) || [];

	const [filteredData, setFilteredData] = useState<any[]>(crewlist);
	const { styles, theme } = useStyles(stylesheet);
	const navigation = useNavigation();

	const keyboard = useAnimatedKeyboard();
	const animatedStyles = useAnimatedStyle(() => ({
		transform: [{ translateY: -keyboard.height.value / 3 }],
		backgroundColor: theme.colors.backgroundDarkBlack,
	}));

	useEffect(() => {
		const filteredCrewList = crewlist.filter(item => `${item?.first_name || ''} ${item?.last_name || ''} ${item?.profession}`?.includes(query));
		setFilteredData(filteredCrewList);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [query]);

	function handleBookmark() {}
	function handleProfileNavigate(id: UniqueId, owner_type?: string) {
		const screen = owner_type === 'Producer' ? 'ProducerProfile' : 'TalentProfile';
		// @ts-ignore
		navigation.navigate(screen, { id });
	}
	const videoinfo = extractVideoInfo(film?.film_link);

	if (isLoading) {
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.black }}>
				<VideoPlayerPlaceholder />
			</SafeAreaView>
		);
	}

	return (
		<ScrollView style={[styles.container]} contentContainerStyle={{ paddingBottom: 82 }}>
			<StatusBar backgroundColor={theme.colors.backgroundDarkBlack} />
			<VideoPlayerHeader filmId={film?.film_id} filmName={truncate(film?.film_name, 24)} />
			<VideoPlayer videoinfo={videoinfo} />
			<View style={styles.profileContainer}>
				<View style={styles.imageContainer}>{film?.owner_profile_picture_url ? <Image style={styles.sizedImage} src={createAbsoluteImageUri(film?.owner_profile_picture_url)} /> : <Person color={theme.colors.borderGray} />}</View>
				<View style={styles.profileTextContainer}>
					<Text style={styles.ownerName}>{capitalized(truncate(film?.owner_name, 20))}</Text>
					<Text style={styles.ownerProfession}>{film?.owner_type}</Text>
				</View>
				<Button onPress={() => handleProfileNavigate(film?.owner_id, film?.owner_type)} style={styles.button}>
					<LongArrowRight color={theme.colors.primary} size="26" />
				</Button>
			</View>
			<Animated.View style={animatedStyles}>
				<View>
					<Text style={styles.header}>Crew ({crewCount})</Text>
					<SearchInput placeholderText="Search Crew" searchQuery={query} setSearchQuery={setQuery} />
				</View>
				<View style={styles.crewlistContainer(crewlist?.length)}>
					{!!crewCount && (
						<FlashList
							data={query ? filteredData : crewlist}
							renderItem={({ item: it }) => (
								<UserItem
									id={it?.id}
									name={`${it?.first_name || ''} ${it?.last_name || ''}`}
									onPress={() => handleProfileNavigate(it.id)}
									profession={it?.profession}
									image={createAbsoluteImageUri(it?.profile_pic_url)}
									cta={
										<View style={styles.centeredContent}>
											<Pressable onPress={handleBookmark} style={styles.bookmark}>
												<Bookmark size="24" strokeWidth={3} color={it?.is_bookmarked ? theme.colors.primary : theme.colors.transparent} strokeColor={theme.colors.primary} />
											</Pressable>
										</View>
									}
								/>
							)}
							estimatedItemSize={67}
							onEndReached={() => {
								if (!isLoading && hasNextPage) {
									fetchNextPage();
								}
							}}
							onEndReachedThreshold={0.5}
							keyExtractor={(item: any, index: any) => item?.id + index}
							ListEmptyComponent={isFetchingNextPage ? <ActivityIndicator size="small" color={theme.colors.primary} /> : <View style={styles.xsVerticalPadding}>{query ? <Text style={styles.centeredText}>No Matching Crew Found</Text> : <Text style={styles.centeredText}>No Crew Added</Text>}</View>}
						/>
					)}
				</View>
			</Animated.View>
		</ScrollView>
	);
}

export default VideoPlayerScreen;

const stylesheet = createStyleSheet(theme => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundDarkBlack,
		fontFamily: 'CabinetGrotesk-Regular',
		paddingTop: Platform.OS === 'ios' ? 50 : 0,
	},
	sizedImage: { width: 80, height: 80 },
	centeredText: {
		fontSize: theme.fontSize.button,
		color: theme.colors.typography,
		textAlign: 'center',
		fontFamily: 'CabinetGrotesk-Regular',
	},
	bookmark: {
		backgroundColor: theme.colors.transparent,
		paddingVertical: 0,
		paddingHorizontal: 0,
	},
	xsVerticalPadding: { paddingVertical: theme.padding.xs },
	profileContainer: {
		flexDirection: 'row',
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderBottomColor: theme.colors.borderGray,
		borderTopColor: theme.colors.borderGray,
		flex: 1,
		maxHeight: 80,
		marginVertical: 24,
		paddingHorizontal: 16,
	},
	imageContainer: {
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		height: 80,
		width: 80,
		justifyContent: 'center',
		alignItems: 'center',
	},
	profileTextContainer: {
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		flex: 1,
		justifyContent: 'center',
		gap: 2,
		paddingHorizontal: 16,
	},
	ownerName: {
		fontSize: theme.fontSize.button,
		fontFamily: 'CabinetGrotesk-Medium',
		color: theme.colors.typography,
	},
	ownerProfession: {
		fontSize: theme.fontSize.title,
		fontFamily: 'CabinetGrotesk-Regular',
		color: theme.colors.typography,
	},
	button: {
		backgroundColor: theme.colors.transparent,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		aspectRatio: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 0,
		paddingHorizontal: 0,
	},
	searchContainer: {},
	header: {
		paddingHorizontal: theme.padding.base,
		fontFamily: 'CabinetGrotesk-Regular',
		color: theme.colors.typography,
		fontSize: theme.fontSize.primaryH2,
	},
	iconViewContainer: {
		flexDirection: 'row',
		flexGrow: 1,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	centeredContent: { justifyContent: 'center', alignItems: 'center' },
	crewlistContainer: (crewlistLength: number) => ({
		marginBottom: theme.margins.xl,
		borderBottomWidth: crewlistLength && theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	}),
	paragraph: {
		color: theme.colors.typographyLight,
		fontSize: theme.fontSize.typographyLg,
		fontFamily: 'CabinetGrotesk-Regular',
	},
	heading: {
		fontSize: theme.fontSize.primaryH1,
		color: theme.colors.typography,
		fontFamily: 'CabinetGrotesk-Medium',
	},
	textinput: {
		color: theme.colors.typography,
		fontFamily: 'CabinetGrotesk-Regular',
		flex: 1,
		fontSize: theme.fontSize.button,
		paddingHorizontal: 0,
	},
}));
