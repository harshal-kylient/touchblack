import { TouchableOpacity, View, ViewProps } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@touchblack/ui';
import { LongArrowRight } from '@touchblack/icons';

interface LabelWithTouchableIconType extends ViewProps {
	label: string;
	onPress?: () => void;
	isHidden?: boolean;
}

function LabelWithTouchableIcon({ label, onPress, style, isHidden = false }: LabelWithTouchableIconType) {
	const { styles, theme } = useStyles(stylesheet);

	const handlePress = () => {
		// Default action when icon is pressed (do nothing)
	};

	const handleOnPress = onPress || handlePress;

	return (
		<View style={[styles.labelContainer, style]}>
			<Text size="primaryMid" color="regular">
				{label}
			</Text>
			<TouchableOpacity onPress={handleOnPress} disabled={isHidden} style={styles.iconButton(isHidden)}>
				<LongArrowRight color={theme.colors.typography} size="24" strokeColor={theme.colors.typography} />
			</TouchableOpacity>
		</View>
	);
}

export default LabelWithTouchableIcon;

const stylesheet = createStyleSheet(theme => ({
	labelContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%',
		paddingHorizontal: theme.padding.base,
	},
	iconButton: (isHidden: boolean) => ({
		opacity: isHidden ? 0 : 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: theme.padding.xxxs,
		paddingHorizontal: theme.padding.sm,
	}),
}));
