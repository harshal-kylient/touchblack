import CONSTANTS from '@constants/constants';
import { Text } from '@touchblack/ui';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Controller } from 'react-hook-form';
import CheckBox from '@components/Checkbox';

export const PermissionsList = ({ control }) => {
	const { styles } = useStyles(stylesheet);

	return (
		<>
			{Object.entries(CONSTANTS.STUDIO_PERMISSIONS).map(
				([key, value], index, array) =>
					index % 2 === 0 && (
						<View key={key} style={[styles.subContainer(index, array.length)]}>
							<View style={styles.cardContainer}>
								<View style={styles.card}>
									<Text color="regular" weight="regular" size="primarySm">
										{key.split('_')[0]}
									</Text>
								</View>
								<View style={styles.checkboxContainer}>
									<Controller control={control} name={value} render={({ field: { onChange, value } }) => <CheckBox value={value} onChange={onChange} />} />
									<Controller control={control} name={array[index + 1][1]} render={({ field: { onChange, value } }) => <CheckBox value={value} onChange={onChange} />} />
								</View>
							</View>
						</View>
					),
			)}
		</>
	);
};

const stylesheet = createStyleSheet(theme => ({
	subContainer: (index, totalLength) => ({
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		borderBottomWidth: index === totalLength - 2 ? theme.borderWidth.bold : theme.borderWidth.none,
	}),
	cardContainer: {
		marginLeft: theme.margins.base,
		marginRight: theme.margins.xl,
		borderLeftWidth: theme.borderWidth.slim,
		borderLeftColor: theme.colors.borderGray,
		borderRightWidth: theme.borderWidth.slim,
		borderRightColor: theme.colors.borderGray,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	card: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: theme.padding.base,
	},
	checkboxContainer: {
		flexDirection: 'row',
		gap: 40,
		marginRight: theme.margins.sm,
	},
}));
