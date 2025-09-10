import React from 'react';
import { View, ViewStyle } from 'react-native';
import { createStyleSheet, UnistylesRuntime, useStyles } from 'react-native-unistyles';

import { Text } from '@touchblack/ui';
import { Triangle } from '@touchblack/icons';

type WrapperProps = {
	children: React.ReactNode;
	bgColor?: string;
	wrapperStyles?: ViewStyle;
	containerStyles?: ViewStyle;
	readAt?: string;
	sentByMe: boolean;
};

export default function Wrapper({ children, wrapperStyles, containerStyles, readAt, sentByMe }: WrapperProps) {
	const { styles, theme } = useStyles(stylesheet);
	const bgColor = sentByMe ? '#50483b' : theme.colors.backgroundLightBlack;
	const borderColor = sentByMe ? '#fff4' : theme.colors.typographyLight;
	const alignSelf = sentByMe ? 'flex-end' : 'flex-start';

	return (
		<View style={[styles.wrapper, wrapperStyles, { alignSelf }]}>
			<View style={[styles.container(bgColor, borderColor), containerStyles]}>{children}</View>
			<Triangle size="12" color={sentByMe ? bgColor : theme.colors.backgroundLightBlack} strokeColor={theme.colors.muted} style={{ position: 'absolute', bottom: 4, right: sentByMe ? theme.padding.xs : undefined, left: sentByMe ? undefined : theme.padding.xs, transform: [{ scaleX: sentByMe ? 1 : -1 }] }} />
			{readAt ? (
				<View style={styles.readReceiptContainer(sentByMe)}>
					<Text size="inputLabel" style={styles.readReceipt}>
						Read {readAt}
					</Text>
				</View>
			) : null}
		</View>
	);
}

const stylesheet = createStyleSheet(theme => ({
	wrapper: {
		maxWidth: UnistylesRuntime.screen.width * 0.8,
		paddingVertical: theme.padding.base,
		paddingHorizontal: theme.padding.xs,
	},
	container: (bgColor: string, borderColor: string) => ({
		backgroundColor: bgColor,
		borderWidth: theme.borderWidth.slim,
		borderColor: borderColor,
	}),
	readReceipt: {
		color: theme.colors.success,
		alignSelf: 'flex-end',
		marginTop: theme.margins.xxs,
	},
	readReceiptContainer: (sentByMe: boolean) => ({
		flexDirection: 'row',
		justifyContent: sentByMe ? 'flex-end' : 'flex-start',
	}),
	senderReceipt: {
		color: theme.colors.typography,
		marginTop: theme.margins.xxs,
	},
}));
