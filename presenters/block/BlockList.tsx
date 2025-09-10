import { ActivityIndicator, Platform, ScrollView, View, RefreshControl } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { SheetManager } from 'react-native-actions-sheet';
import { Slideable, Text } from '@touchblack/ui';

import useGetBlockList from '@network/useGetBlockList';
import { FlashList } from '@shopify/flash-list';
import { SheetType } from 'sheets';
import BlockItem from './BlockItem';
import IBlockItem from '@models/entities/IBlockItem';
import { Show } from '@touchblack/icons';
import Header from '@components/Header';
import formatName from '@utils/formatName';

export default function BlockList() {
	const { styles, theme } = useStyles(stylesheet);
	const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching, refetch } = useGetBlockList();

	function handleUnblock(item: IBlockItem) {
		SheetManager.show('Drawer', {
			payload: {
				sheet: SheetType.Unblock,
				data: {
					name: formatName(item?.first_name, item?.last_name),
					blocked_id: item?.id,
					onSuccess: async () => {
						await refetch();
					},
				},
			},
		});
	}

	if (isLoading) {
		return <ActivityIndicator size="small" color={theme.colors.primary} style={styles.loadingContainer} />;
	}

	return (
		<ScrollView style={styles.container}>
			<Header name="Blocked Lists" />
			{data?.length ? (
				<FlashList
					data={data}
					renderItem={({ item }) => (
						<Slideable
							buttonElement={
								<View style={styles.button}>
									<Show size="24" color={theme.colors.typography} />
									<Text size="bodySm" color="regular">
										Unblock
									</Text>
								</View>
							}
							onButtonPress={() => handleUnblock(item)}>
							<BlockItem {...item} />
						</Slideable>
					)}
					estimatedItemSize={64}
					onEndReached={() => {
						if (!isLoading && hasNextPage) {
							fetchNextPage();
						}
					}}
					refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
					onEndReachedThreshold={0.5}
					keyExtractor={(item: any) => item?.id || ''}
					ListFooterComponent={() => (isFetchingNextPage ? <ActivityIndicator size="small" color={theme.colors.primary} /> : null)}
				/>
			) : (
				<View style={styles.expand}>
					<Text size="secondary" color="regular">
						No Blocked Users
					</Text>
				</View>
			)}
		</ScrollView>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		flex: 1,
		paddingTop: Platform.OS === 'ios' ? 50 : 0,
		paddingVertical: theme.padding.xs,
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
	expand: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	button: {
		backgroundColor: theme.colors.success,
		width: 64,
		height: 64,
		justifyContent: 'center',
		alignItems: 'center',
		marginVertical: 1,
	},
	loadingContainer: { backgroundColor: theme.colors.black, flex: 1 },
}));
