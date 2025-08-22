import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { FlashList } from '@shopify/flash-list';
import { Slideable, Text } from '@touchblack/ui';

import useGetBlackBookTalentsByProfession from '@network/useGetBlackBookTalentsByProfession';
import useArchiveBlackBook from '@network/useArchiveBlackBook';
import TextWithIconPlaceholder from '@components/loaders/TextWithIconPlaceholder';
import TalentThumbnailCard from '@components/TalentThumbnailCard';
import ToggleArchiveButton from '@components/ToggleArchiveButton';

function BlackBookListByProfession({ profession }: { profession: any }) {
	const { styles } = useStyles(stylesheet);
	const { data: talentResponse, isLoading, hasNextPage, fetchNextPage } = useGetBlackBookTalentsByProfession(profession.id);
	const talents = talentResponse?.pages.flatMap(page => page?.data) || [];
	const professionWithNoTalents = talents.length === 0 || (talents.length === 1 && Object.keys(talents[0]).length === 0);

	const { handleArchive } = useArchiveBlackBook();

	if (isLoading) {
		return (
			<View style={styles.noDataFound}>
				<TextWithIconPlaceholder />
			</View>
		);
	}

	if (professionWithNoTalents) {
		return (
			<View style={[styles.noDataFound, { justifyContent: 'center', alignItems: 'center' }]}>
				<Text color="muted" size="inputLabel">
					No talents found
				</Text>
			</View>
		);
	} else {
		return (
			<View style={{ height: talents.length * 64 }}>
				<FlashList
					data={talents}
					onEndReached={() => {
						if (!isLoading && hasNextPage) {
							fetchNextPage();
						}
					}}
					estimatedItemSize={100}
					renderItem={({ item }) => (
						<Slideable
							key={item.id}
							onButtonPress={() => {
								handleArchive(item.id, profession.id);
							}}
							buttonElement={<ToggleArchiveButton isCurrentlyArchived={false} />}>
							<TalentThumbnailCard item={item} />
						</Slideable>
					)}
				/>
			</View>
		);
	}
}

export default BlackBookListByProfession;

const stylesheet = createStyleSheet(() => ({
	noDataFound: {
		height: 64,
		width: '100%',
	},
}));
