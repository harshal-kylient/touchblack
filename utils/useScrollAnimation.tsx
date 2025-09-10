import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

const useScrollAnimation = () => {
	const scrollY = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		const listenerId = scrollY.addListener(({ value }) => {});

		return () => {
			scrollY.removeListener(listenerId);
		};
	}, [scrollY]);

	const interpolateStyles = (scrollY: Animated.Value) => ({
		backgroundImageTransform: {
			transform: [
				{
					scale: scrollY.interpolate({
						inputRange: [1, 336],
						outputRange: [1, 0.152],
						extrapolateRight: 'clamp',
					}),
				},
			],
			transformOrigin: 'bottom left',
			minHeight: 60,
		},
		aboutContainerTransform: {
			transform: [
				{
					translateX: scrollY.interpolate({
						inputRange: [1, 336],
						outputRange: [0, 76],
					}),
				},
			],
		},
	});

	const handleScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true });

	return { scrollY, interpolateStyles, handleScroll };
};

export default useScrollAnimation;
