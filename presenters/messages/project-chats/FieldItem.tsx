import { ReactNode } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@touchblack/ui';

export const FieldItem = ({ label, value, orientation = 'column', style }: { label: string | ReactNode; value: string | null | ReactNode; orientation?: 'row' | 'column'; style?: StyleProp<ViewStyle> }) => {
	const { styles } = useStyles(stylesheet);
	return (
		<View style={[styles.field(orientation), style]}>
			{typeof label === 'string' && (
				<Text size="bodySm" color="muted">
					{label}
				</Text>
			)}
			{typeof label !== 'string' && label}
			{typeof value === 'string' && (
				<Text size="bodyMid" color="regular" style={styles.value}>
					{value}
				</Text>
			)}
			{typeof value !== 'string' && value}
		</View>
	);
};

const stylesheet = createStyleSheet(theme => ({
	field: (orientation: 'row' | 'column') => ({
		gap: theme.gap.steps,
		flexDirection: orientation,
		justifyContent: 'space-between',
	}),
	value: {
		lineHeight: theme.lineHeight.custom,
		maxWidth: '80%',
	},
}));
