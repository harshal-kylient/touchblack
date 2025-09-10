import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { ImageBackground, Pressable, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Text } from '@touchblack/ui';

import ScrollableHorizontalGrid from '@components/ScrollableHorizontalGrid';
import useGetProducersList from '@network/useGetProducersList';
import MediumGridPlaceholder from '@components/loaders/MediumGridPlaceholder';
import { useAuth } from '@presenters/auth/AuthContext';
import { Person } from '@touchblack/icons';
import capitalized from '@utils/capitalized';
import createAbsoluteImageUri from '@utils/createAbsoluteImageUri';

interface IProducerListProps {
	profile_picture_url: string;
	name: string;
	active: boolean;
	id: string;
}

function ProducersList() {
	const { styles, theme } = useStyles(stylesheet);
	const { data: producersList, isLoading } = useGetProducersList();
	const { producerId: myProducerId } = useAuth();
	const navigation = useNavigation<any>();

	const removeOwnProducer = (producerId: string) => {
		if (producerId !== myProducerId) {
			return true;
		}
		return false;
	};

	const filteredProducersList = producersList?.length > 0 ? producersList.filter((producer: IProducerListProps) => removeOwnProducer(producer.id)) : [];

	function handleProducerListItemPress(producerId: string) {
		navigation.navigate('ProducerProfile', { id: producerId });
	}

	if (isLoading) {
		return <MediumGridPlaceholder />;
	}

	return (
		<ScrollableHorizontalGrid
			customStyles={{
				borderBottomColor: theme.colors.borderGray,
				borderBottomWidth: theme.borderWidth.bold,
			}}>
			{filteredProducersList.map((item: IProducerListProps, index: number) => {
				return (
					<Pressable key={index} onPress={() => handleProducerListItemPress(item.id)}>
						<View style={styles.itemContainer}>
							{item?.profile_picture_url ? <ImageBackground resizeMode="cover" style={styles.backgroundImage} source={{ uri: createAbsoluteImageUri(item?.profile_picture_url) }} /> : <Person size="180" color={theme.colors.muted} />}
							<View style={styles.contentContainer}>
								<Text color={'regular'} numberOfLines={1} style={styles.textStyles} size="button">
									{capitalized(item.name)}
								</Text>
							</View>
						</View>
					</Pressable>
				);
			})}
		</ScrollableHorizontalGrid>
	);
}

export default ProducersList;

const stylesheet = createStyleSheet(theme => ({
	itemContainer: {
		display: 'flex',
		gap: 5,
		justifyContent: 'center',
		alignItems: 'center',
		borderRightWidth: theme.borderWidth.slim,
		borderLeftWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		position: 'relative',
		variants: {
			isActive: {
				true: {
					backgroundColor: theme.colors.primary,
				},
				false: {
					backgroundColor: theme.colors.transparent,
				},
			},
		},
	},
	bottomBorder: {
		borderBottomColor: theme.colors.borderGray,
		borderBottomWidth: theme.borderWidth.bold,
	},
	backgroundImage: {
		flex: 1,
		justifyContent: 'center',
		width: 180,
		aspectRatio: 1 / 1,
	},
	contentContainer: {
		position: 'absolute',
		bottom: 0,
		paddingVertical: theme.padding.xs,
		paddingHorizontal: theme.padding.base,
		width: '100%',
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
	textStyles: {
		textAlign: 'left',
		fontFamily: theme.fontFamily.cgMedium,
	},
}));
