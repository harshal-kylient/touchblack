import { Pressable, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { ReactElement } from 'react';

import { Text } from '@touchblack/ui';
import { CheckBoxFilled } from '@touchblack/icons';

interface IProps {
	value: boolean;
	onChange: (value: boolean) => void;
	content?: ReactElement;
	title?: string;
}

const CheckBox = ({ value = false, onChange, title, content }: IProps) => {
	const { styles, theme } = useStyles(stylesheet);

	function handlePress() {
		onChange(!value);
	}

	return (
		<View style={styles.container}>
			<Pressable onPress={handlePress} style={styles.checkbox}>
				<CheckBoxFilled color={value ? theme.colors.primary : 'none'} size="28" style={styles.checkIcon} />
			</Pressable>
			<CheckboxContent content={content} title={title} />
		</View>
	);
};

export default CheckBox;

const CheckboxContent = ({ content, title }: Pick<IProps, 'content' | 'title'>) => {
	return content ? (
		content
	) : (
		<Text size="bodyMid" color="regular">
			{title}
		</Text>
	);
};

const stylesheet = createStyleSheet(theme => ({
	container: {
		justifyContent: 'flex-start',
		alignItems: 'center',
		flexDirection: 'row',
	},
	checkIcon: { position: 'absolute', top: -5, left: -5 },
	checkbox: () => ({
		width: 20,
		height: 20,
		marginRight: theme.margins.xs,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.primary,
	}),
}));
