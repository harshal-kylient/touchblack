import React from 'react';
import { Image, Pressable } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useNavigation } from '@react-navigation/native';

import { FlashList } from '@shopify/flash-list';

import NoPhotos from '@components/errors/NoPhotos';
import useGetStudioFloorImages from '@network/useGetStudioFloorImages';
import createAbsoluteImageUri from '@utils/createAbsoluteImageUri';

const numberOfColumns = 3;

interface PhotosTabProps {
	floorId: string;
}

interface Image {
	id: string;
	url: string;
}

export const PhotosTab: React.FC<PhotosTabProps> = ({ floorId }) => {
	const { styles } = useStyles(stylesheet);
	const navigation = useNavigation();
	const { data } = useGetStudioFloorImages(floorId);
	const images: Image[] = data?.data.data;

	const handleImagePress = (images: Image[]) => {
		navigation.navigate('PhotoGallery', { photos: images });
	};

	return (
		<FlashList
			data={images}
			renderItem={({ item }: { item: Image }) => (
				<Pressable onPress={() => handleImagePress([item])} style={styles.imageContainer}>
					<Image style={styles.image} source={{ uri: createAbsoluteImageUri(item.url) }} />
				</Pressable>
			)}
			keyExtractor={item => item.id}
			estimatedItemSize={100}
			numColumns={numberOfColumns}
			ListEmptyComponent={<NoPhotos />}
			ListFooterComponentStyle={{ marginBottom: 4 }}
		/>
	);
};

const stylesheet = createStyleSheet(theme => ({
	imageContainer: {
		flex: 1,
		margin: 4,
	},
	image: {
		width: '100%',
		aspectRatio: 1,
	},
}));
