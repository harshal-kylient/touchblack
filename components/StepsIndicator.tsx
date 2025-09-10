import { View, StyleProp, ViewStyle } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface IStepsIndicatorProps {
	totalSteps: number;
	currentStep: number;
	stepColor?: string;
	completedStepColor?: string;
	stepSize?: number;
	customStyles?: StyleProp<ViewStyle>;
}

function StepsIndicator({ totalSteps, currentStep, stepSize = 6, customStyles }: IStepsIndicatorProps) {
	const { styles } = useStyles(stylesheet);

	const steps = Array.from({ length: totalSteps }, (_, index) => index + 1);

	return (
		<View style={[styles.container, customStyles]}>
			{steps.map(step => (
				<View key={step} style={styles.getStepStyle(step, currentStep, stepSize)} />
			))}
		</View>
	);
}

export { StepsIndicator, type IStepsIndicatorProps };

const stylesheet = createStyleSheet(theme => ({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		gap: theme.gap.steps,
	},
	getStepStyle: (step: number, currentStep: number, stepSize: number) => ({
		backgroundColor: step === currentStep ? theme.colors.primary : theme.colors.typography,
		width: step === currentStep ? 40 : stepSize,
		height: stepSize,
	}),
}));
