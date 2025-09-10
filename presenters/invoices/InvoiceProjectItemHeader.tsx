import { Pressable, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Radio, RadioFilled } from '@touchblack/icons';
import { Text } from '@touchblack/ui';
import { useInvoicesContext } from './context/InvoicesContext';

interface InvoiceProjectItemHeaderProps {
	title: string;
	filmType: string;
	index: number;
}

export const InvoiceProjectItemHeader = ({ title, filmType, index }: InvoiceProjectItemHeaderProps) => {
	const { styles, theme } = useStyles(stylesheet);
	const { state, dispatch } = useInvoicesContext();

	const handleProjectSelection = () => {
		dispatch({
			type: 'SELECT_PROJECT',
			payload: state.selectedProject === index ? null : index,
		});
	};

	return (
		<View style={styles.header}>
			<Pressable onPress={handleProjectSelection}>{state.selectedProject === index ? <RadioFilled size="24" color={theme.colors.primary} /> : <Radio size="24" color={theme.colors.muted} />}</Pressable>
			<View style={styles.title}>
				<Text size="secondary" color="regular">
					{title}
				</Text>
				<Text size="bodyMid" color="regular">
					({filmType})
				</Text>
			</View>
		</View>
	);
};

const stylesheet = createStyleSheet(theme => ({
	header: {
		flexDirection: 'row',
		gap: theme.gap.xs,
		justifyContent: 'center',
		alignItems: 'center',
	},
	title: {
		flexDirection: 'row',
		gap: theme.gap.steps,
		alignItems: 'flex-end',
	},
}));
