import FilmItem from '@components/FilmItem';
import IFilm from '@models/entities/IFilm';
import { Accordion, Button, Text } from '@touchblack/ui';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { ActivityIndicator, FlatList, Pressable, SafeAreaView, View } from 'react-native';
import useGetShowreels from '@network/useGetShowreels';
import TextWithIconPlaceholder from '@components/loaders/TextWithIconPlaceholder';
import FilmOptionsEnum from '@models/enums/FilmOptionsEnum';
import { useAuth } from '@presenters/auth/AuthContext';
import { SheetManager } from 'react-native-actions-sheet';
import { SheetType } from 'sheets';
import CONSTANTS from '@constants/constants';
import { useSubscription } from '@presenters/subscriptions/subscriptionRestrictionContext';

interface IProps {
	profession: { id: UniqueId; name: string };
	talentId: string;
	open?: boolean;
}

export default function VideoListByProfession({ profession, talentId, open = false }: IProps) {
	const { styles, theme } = useStyles(stylesheet);
	const { userId: loggedInTalentId, loginType } = useAuth();
	const { data: response, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage, refetch: mutate } = useGetShowreels(talentId, profession?.id);
	const data = response?.pages.flatMap(page => page?.data) || [];
	const showreelEditable = talentId === loggedInTalentId || loginType === 'manager';
	const { subscriptionData } = useSubscription();
	const hasRestrictedFilm = data.some(film => film.is_restricted);
	if (isLoading) {
		return <TextWithIconPlaceholder />;
	}
	const handleShowReelPopUp = () => {
		const restriction = subscriptionData[CONSTANTS.POPUP_TYPES.PROFILE_VIEW_FILM];
		if (restriction?.data?.popup_configuration) {
			SheetManager.show('Drawer', {
				payload: {
					sheet: SheetType.SubscriptionRestrictionPopup,
					data: restriction.data.popup_configuration,
				},
			});
		} else {
			return;
		}
	};

	return (
		<Accordion customStyles={styles.accordionContainer} isExpanded={open} title={profession?.name}>
			<FlatList
				bounces={false}
				data={data}
				renderItem={({ item: film }: { item: IFilm }) => (
					<View style={styles.filmItemsContainer}>
						<FilmItem showPinned mutate={mutate} editable={showreelEditable} type={FilmOptionsEnum.Showreel} key={film?.film_id} film={film} restricted={film.is_restricted} />
					</View>
				)}
				onEndReached={() => {
					if (!isLoading && hasNextPage) {
						fetchNextPage();
					}
				}}
				onEndReachedThreshold={0.5}
				keyExtractor={(film: any) => film?.film_id || ''}
				ListFooterComponent={() => (
					<>
						{isFetchingNextPage && <ActivityIndicator size="small" color={theme.colors.primary} style={styles.loader} />}
						{hasRestrictedFilm && (
							<Button onPress={handleShowReelPopUp} style={styles.button} textColor="primary">
								Show more
							</Button>
						)}
					</>
				)}
			/>
		</Accordion>
	);
}

const stylesheet = createStyleSheet(theme => ({
	accordionContainer: {
		backgroundColor: theme.colors.black,
	},
	loaderContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
	button: {
		marginHorizontal: theme.margins.base,
		backgroundColor: theme.colors.black,
		borderColor: theme.colors.primary,
		borderWidth: 1,
		marginBottom: theme.margins.base * 2,
		marginVertical: theme.margins.base,
	},
	filmItemsContainer: {
		marginTop: theme.margins.xs,
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.bold,
		paddingHorizontal: theme.padding.base,
		paddingVertical: 1,
		borderColor: theme.colors.borderGray,
	},
	loader: {
		width: 200,
		height: 193,
		justifyContent: 'center',
		alignItems: 'center',
	},
}));
