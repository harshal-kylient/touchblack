import { ImageProps } from 'react-native';
import thumbnailImage from '../../../../assets/images/home/talentThumbnailImage.png';

export type WorkedWithMockDataProps = {
	imageSource: ImageProps;
	bookmarked: boolean;
	name: string;
	role: string;
	connection?: string;
};

export const WorkedWithMockData: WorkedWithMockDataProps[] = [
	{
		imageSource: thumbnailImage,
		name: 'Anurag Kashyap',
		role: 'Director',
		bookmarked: true,
		connection: '1st',
	},
	{
		imageSource: thumbnailImage,
		name: 'Johnny Depp',
		role: 'Actor',
		bookmarked: false,
		connection: '2nd',
	},
	{
		imageSource: thumbnailImage,
		name: 'Jen Atkin',
		role: 'Hairdresser',
		bookmarked: false,
		connection: '3rd',
	},
];
