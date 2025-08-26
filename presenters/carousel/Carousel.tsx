import { Image, Platform, SafeAreaView, ScrollView, StatusBar, View } from 'react-native';
import { createStyleSheet, useStyles, UnistylesRuntime } from 'react-native-unistyles';
import { Button, Text } from '@touchblack/ui';
import { StepsIndicator } from '@components/StepsIndicator';
import { useCarousel } from './carouselHooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Carousel() {
	const { styles, theme } = useStyles(stylesheet);
	const { MainImageScrollViewRef, ThumnailImageRef, currentIndex, handleButtonClick, handleMomentumScroll, transferToNextScreen, carouselData } = useCarousel();
	const insets = useSafeAreaInsets();
	return (
		<SafeAreaView style={styles.carouselContainer}>
			<StatusBar barStyle="light-content" backgroundColor={theme.colors.backgroundLightBlack} />
			<View style={styles.header}>
				<Button type="inline" textColor="regular" onPress={transferToNextScreen}>
					Skip
				</Button>
			</View>
			<View style={styles.body}>
				<View style={styles.mainImageContainer}>
					<ScrollView ref={MainImageScrollViewRef} onMomentumScrollEnd={handleMomentumScroll} horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.mainImageScrollView}>
						{carouselData.map(image => (
							<Image key={image.id} style={styles.mainImage} source={image.mainImage} />
						))}
					</ScrollView>
				</View>
				<View style={styles.contentAndThumbnailContainer}>
					<View style={styles.contentContainer}>
						<Text maxWidth={220} size="primaryBig" color="regular">
							{carouselData[currentIndex].title}
						</Text>
						<Text maxWidth={262} size="bodyBig" color="muted">
							{carouselData[currentIndex].description}
						</Text>
						<StepsIndicator customStyles={styles.stepsIndicator} currentStep={carouselData[currentIndex].id + 1} totalSteps={4} />
					</View>
					<View style={styles.thumbnailImageContainer}>
						<ScrollView scrollEnabled={false} ref={ThumnailImageRef} horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.thumbnailScrollView}>
							{carouselData.map(image => (
								<Image key={image.id} style={styles.thumbnailImage} width={80} height={80} source={image.thumbnailImage} />
							))}
						</ScrollView>
					</View>
				</View>
				<View style={styles.footer}>
					<Button type="primary" textColor="black" style={styles.button} onPress={handleButtonClick}>
						{carouselData[currentIndex].buttonLabel}
					</Button>
				</View>
			</View>
		</SafeAreaView>
	);
}

const stylesheet = createStyleSheet(theme => ({
	carouselContainer: {
		flex: 1,
		height: UnistylesRuntime.screen.height + 1,
		backgroundColor: theme.colors.backgroundLightBlack,
		paddingTop: Platform.OS === 'ios' ? 50 : 0,
	},
	header: {
		alignItems: 'flex-end',
		paddingHorizontal: theme.padding.xxl,
		paddingBottom: theme.padding.xxl,
		width: UnistylesRuntime.screen.width,
	},
	body: {
		borderColor: theme.colors.borderGray,
		borderTopWidth: theme.borderWidth.slim,
		flex: 1,
		justifyContent: 'space-between',
	},
	slide: {
		width: UnistylesRuntime.screen.width,
	},
	mainImageContainer: {
		flex: 1,
		flexDirection: 'row',
		overflow: 'hidden',
	},
	mainImageScrollView: {
		marginRight: 80,
		minHeight: 444,
		flex: 1,
		// width: UnistylesRuntime.screen.width - 80,
		borderColor: theme.colors.borderGray,
		borderRightWidth: theme.borderWidth.slim,
	},
	mainImage: {
		resizeMode: 'cover',
		height: '100%',
		width: UnistylesRuntime.screen.width - 79.5,
	},
	contentAndThumbnailContainer: {
		flexDirection: 'row',
		width: '100%',
		// flexGrow: 1,
		justifyContent: 'space-between',
		// maxHeight: 140,
	},
	contentContainer: {
		padding: theme.padding.xxl,
		justifyContent: 'flex-start',
		gap: theme.gap.xxs,
		flexGrow: 1,
		alignItems: 'flex-start',
		borderColor: theme.colors.borderGray,
		borderRightWidth: theme.borderWidth.slim,
	},
	stepsIndicator: {
		marginTop: theme.margins.xxs,
	},
	thumbnailImageContainer: {
		width: 80,
		overflow: 'hidden',
	},
	thumbnailScrollView: {
		width: 80,
		height: 80,
		flex: 1,
		overflow: 'hidden',
	},
	thumbnailImage: {
		width: 80,
		height: 80,
		resizeMode: 'contain',
	},
	footer: {
		padding: theme.padding.base,
		borderColor: theme.colors.borderGray,
		borderTopWidth: theme.borderWidth.slim,
	},
	button: {
		borderColor: theme.colors.typography,
		borderWidth: theme.borderWidth.slim,
	},
}));
