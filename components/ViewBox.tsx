import { ReactNode } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface ViewBoxProps {
	isBlack: boolean;
	children: ReactNode;
}

export default function ViewBox({ isBlack, children, ...props }: ViewBoxProps) {
	const { styles } = useStyles(stylesheet);
	return (
		<View style={styles.container} {...props}>
			<View style={styles.subContainer(isBlack)}>{children}</View>
		</View>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		zIndex: -9,
		justifyContent: 'center',
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.muted,
		paddingHorizontal: 16,
		paddingVertical: 1,
	},
	subContainer: isBlack => ({
		backgroundColor: isBlack ? theme.colors.black : theme.colors.backgroundDarkBlack,
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.muted,
		alignItems: 'center',
		paddingVertical: theme.padding.xxxxl,
	}),
}));
