import { Pressable, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useNavigation } from '@react-navigation/native';

import { Button, Text } from '@touchblack/ui';
import { useFilterContext } from './FilterContext';
import { useEffect, useState } from 'react';

interface IProps {}

function FilterFooter({ applied, setApplied }: IProps) {
	const { styles, theme } = useStyles(stylesheet);
	const [message, setMessage] = useState('');
	const { dispatch } = useFilterContext();
	const navigation = useNavigation();

	useEffect(() => {
		navigation.addListener('beforeRemove', () => {
			if (applied) {
				return;
			}
			dispatch({ type: 'RESET_FILTERS' });
			setApplied(false);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleFilterReset = () => {
		dispatch({ type: 'RESET_FILTERS' });
		setMessage('Filters have been reset');
		setTimeout(() => setMessage(''), 3000);
		setApplied(false);
	};

	function handleApply() {
		setApplied(true);
		navigation.goBack();
	}

	return (
		<View style={styles.footer}>
			{message ? (
				<Pressable onPress={() => setMessage('')} style={{ justifyContent: 'center', alignItems: 'center', borderBottomWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, paddingVertical: theme.padding.xxs }}>
					<Text color="regular" size="bodyBig" style={{ color: theme.colors.success }}>
						{message}
					</Text>
				</Pressable>
			) : null}
			<View style={styles.ButtonsContainer}>
				<Button
					textColor="regular"
					style={{
						flex: 1,
						borderWidth: theme.borderWidth.slim,
						borderColor: theme.colors.borderGray,
					}}
					type="secondary"
					onPress={handleFilterReset}>
					Reset
				</Button>
				<Button onPress={handleApply} style={{ flex: 1 }}>
					Apply
				</Button>
			</View>
		</View>
	);
}

export default FilterFooter;

const stylesheet = createStyleSheet(theme => ({
	ButtonsContainer: {
		width: '100%',
		flexDirection: 'row',
		padding: theme.padding.base,
		backgroundColor: theme.colors.backgroundDarkBlack,
		borderTopWidth: theme.borderWidth.bold,
		borderColor: theme.colors.borderGray,
	},
	footer: {
		position: 'absolute',
		bottom: 20,
		width: '100%',
		backgroundColor: theme.colors.black,
		borderTopColor: theme.colors.borderGray,
		borderTopWidth: theme.borderWidth.slim,
	},
}));
