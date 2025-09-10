import { useCallback, useRef, useState } from 'react';
import { ImageSourcePropType, NativeScrollEvent, NativeSyntheticEvent, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UnistylesRuntime } from 'react-native-unistyles';

export const useCarousel = () => {
	const MainImageScrollViewRef = useRef<ScrollView>(null);
	const ThumnailImageRef = useRef<ScrollView>(null);
	const [currentIndex, setCurrentIndex] = useState<number>(0);
	const navigation = useNavigation<any>();

	const transferToNextScreen = useCallback(() => {
		navigation.navigate('Login');
	}, [navigation]);

	const handleButtonClick = useCallback(() => {
		if (currentIndex === 3) {
			transferToNextScreen();
			return;
		}

		const nextIndex = currentIndex + 1;
		setCurrentIndex(nextIndex);

		const imageWidth = UnistylesRuntime.screen.width - 80;

		// Scroll main image view to the next image
		if (MainImageScrollViewRef.current) {
			const scrollX = nextIndex * imageWidth;
			MainImageScrollViewRef.current.scrollTo({ x: scrollX });
		}

		// Scroll thumbnail view to the next thumbnail
		if (ThumnailImageRef.current) {
			const scrollX = nextIndex * 80; // Fixed thumbnail image width
			ThumnailImageRef.current.scrollTo({ x: scrollX });
		}
	}, [currentIndex, transferToNextScreen]);

	const handleMomentumScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
		const newCurrentIndex = Math.round(event.nativeEvent.contentOffset.x / (UnistylesRuntime.screen.width - 80));
		setCurrentIndex(newCurrentIndex);

		if (ThumnailImageRef.current) {
			const scrollX = newCurrentIndex * 80; // Fixed thumbnail image width
			ThumnailImageRef.current.scrollTo({ x: scrollX, animated: true });
		}
	}, []);

	return {
		MainImageScrollViewRef,
		ThumnailImageRef,
		currentIndex,
		handleButtonClick,
		handleMomentumScroll,
		transferToNextScreen,
		carouselData,
	};
};

export interface ICarouselData {
	id: number;
	title: string;
	description: string;
	buttonLabel: string;
	mainImage: ImageSourcePropType;
	thumbnailImage: ImageSourcePropType;
}

const carouselData: ICarouselData[] = [
	{
		id: 0,
		title: 'Find your dream crew!',
		description: 'From 15000+ verified talent, 67 roles, in over 5400 films.',
		buttonLabel: 'Interesting!',
		mainImage: require('@assets/images/carousel/mainImages/1.png'),
		thumbnailImage: require('@assets/images/carousel/thumbnailImages/1.png'),
	},
	{
		id: 1,
		title: 'Add to favourite',
		description: 'Ditch the spreadsheet & save all your favourite talent in one place.',
		buttonLabel: 'Okay!',
		mainImage: require('@assets/images/carousel/mainImages/2.png'),
		thumbnailImage: require('@assets/images/carousel/thumbnailImages/2.png'),
	},
	{
		id: 2,
		title: 'Make your REEL WORK',
		description: 'Filters and weekly updates, your showreel was never this powerful!',
		buttonLabel: 'Oh Curious!',
		mainImage: require('@assets/images/carousel/mainImages/3.png'),
		thumbnailImage: require('@assets/images/carousel/thumbnailImages/3.png'),
	},
	{
		id: 3,
		title: 'Pin to \ntop!',
		description: 'Always see the messages that matter, right up there.',
		buttonLabel: "Let's go!",
		mainImage: require('@assets/images/carousel/mainImages/4.png'),
		thumbnailImage: require('@assets/images/carousel/thumbnailImages/4.png'),
	},
];
