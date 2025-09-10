import { ReactNode } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

const stylesheet = createStyleSheet(theme => ({
	row: {
		paddingVertical: theme.padding.xs,
		paddingHorizontal: theme.padding.base,
		backgroundColor: theme.colors.backgroundLightBlack,
		gap: theme.padding.xxxs,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	contentContainer: {
		flex: 1,
		flexDirection: 'row',
	},
	iconContainer: {},
}));

type ContentRowProps = {
	leftSideChildren?: ReactNode;
	rightSideChildren?: ReactNode;
	onPress?: () => void;
	rightPressHandler?: () => void;
	customStyle?: StyleProp<ViewStyle>;
};

function ContentRow({ leftSideChildren, rightSideChildren, customStyle }: ContentRowProps) {
	const { styles } = useStyles(stylesheet);

	return (
		<View style={[styles.row, customStyle]}>
			<View style={styles.contentContainer}>{leftSideChildren}</View>
			<View style={styles.iconContainer}>{rightSideChildren}</View>
		</View>
	);
}

export default ContentRow;
