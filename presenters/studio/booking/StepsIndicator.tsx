import { View } from 'react-native';

import { Text } from '@touchblack/ui';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';

export default function StudioStepsIndicator({ step }: { step: number }) {
	const { styles, theme } = useStyles(stylesheet);

	return (
		<>
			<View style={styles.container}>
				<View style={styles.stepContainer}>
					<View style={styles.step(step, 0)} />
					<View style={styles.step(step, 1)} />
					<View style={styles.step(step, 2)} />
				</View>
				<View style={styles.stepNumber}>
					<Text size="inputLabel" color="regular">
						0{step + 1}
					</Text>
					<Text size="inputLabel" color="muted">
						/03
					</Text>
				</View>
			</View>
			{/*<Text color="muted" size="bodyBig" style={{ paddingHorizontal: theme.padding.base, paddingVertical: theme.padding.base }}>
				{desc[step]}
			</Text>*/}
		</>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: theme.gap.xs,
		marginHorizontal: theme.gap.base,
		maxWidth: UnistylesRuntime.screen.width,
	},
	stepContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: theme.gap.steps,
		flex: 1,
	},
	step: (currentStep: number, stepNumber: number) => ({
		backgroundColor: currentStep >= stepNumber ? (currentStep === 0 && stepNumber === 0 ? '#466EFC' : currentStep === 1 ? theme.colors.primary : theme.colors.success) : theme.colors.borderGray,
		height: 4,
		flex: 1,
	}),
	stepNumber: {
		flexDirection: 'row',
	},
}));
