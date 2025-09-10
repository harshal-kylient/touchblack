import { SafeAreaView, ScrollView, StatusBar, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Button, Form, Text } from '@touchblack/ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useProjects } from './ProjectContext';
import ProjectStepsIndicator from './ProjectStepsIndicator';
import Header from '@components/Header';
import TalentTypeSearchSuggestionsAndList from './talentSelection/TalentTypeSearchSuggestionsAndList';
import TalentSelectionGuide from './talentSelection/TalentSelectionGuide';
import BlurOverlay from './talentSelection/BlurOverlay';
import NewProjectDetailsReview from './newProjectDetailsReview/NewProjectDetailsReview';
import { useState } from 'react';
import { formSchema } from './form/formSchema';
import NewProjectForm from './form/NewProjectForm';

function NewProject() {
	const { styles, theme } = useStyles(stylesheet);
	const { formSteps, setFormSteps, project, canReview, isTalentSelectionGuideOpen, setIsTalentSelectionGuideOpen } = useProjects();
	const [, setValidationError] = useState('');

	type FormData = z.infer<typeof formSchema>;

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			step1: {
				filmType: 'Ad Film',
				brandName: '',
				projectName: 'New project',
				location: 'Pune',
				filmBrief: '',
			},
			step2: {
				talentTypes: [],
			},
		},
	});

	const { isDirty, isValid } = form.formState;

	const handleNextStep = () => {
		if (formSteps === 1) {
			form.handleSubmit(
				() => {
					setValidationError('');
					setFormSteps(formSteps + 1);
				},
				errors => {
					const errorMessages = Object.values(errors.step1 || {})
						.map(error => error?.message)
						.filter(Boolean);
					setValidationError(errorMessages.join(', '));
				},
			)();
		} else {
			setFormSteps(formSteps + 1);
		}
	};

	const handleProjectSubmit = () => {
		form.handleSubmit(() => {})();
	};

	const subTitle = (() => {
		switch (formSteps) {
			case 1:
				return 'Follow the steps to create a project';
			case 2:
				return `Follow the steps to add the talents for project ${project?.project_name || 'dummy project'}`;
			case 3:
				return `Follow the steps to review the talents for project ${project?.project_name || 'dummy project'}`;
			default:
				return 'Default subtitle';
		}
	})();

	const headerText = (() => {
		switch (formSteps) {
			case 1:
				return 'Project Creation';
			case 2:
				return 'Talent Selection';
			case 3:
				return 'Confirm Talent';
			default:
				return 'Default header';
		}
	})();

	const renderStepContent = () => {
		switch (formSteps) {
			case 1:
				return <NewProjectForm />;
			case 2:
				return (
					// <FormField
					// control={control}
					// name="step2.talentTypes"
					// render={({ field }) => (
					<TalentTypeSearchSuggestionsAndList />
					// )}
					// />
				);
			case 3:
				return <NewProjectDetailsReview />;
			default:
				return null;
		}
	};

	const renderFooter = () => {
		switch (formSteps) {
			case 1:
				return (
					<View style={styles.buttonContainer}>
						<Button onPress={handleNextStep} textColor={!isDirty || !isValid ? 'muted' : 'black'} isDisabled={!isDirty || !isValid} style={!isDirty || !isValid ? styles.disabledButton : styles.button}>
							Add Talent
						</Button>
					</View>
				);
			case 2:
				return (
					<View>
						{isTalentSelectionGuideOpen && <TalentSelectionGuide onClose={() => setIsTalentSelectionGuideOpen(false)} />}
						<View style={styles.buttonContainer}>
							<Button type="primary" textColor={canReview ? 'black' : 'muted'} onPress={handleNextStep} isDisabled={!canReview} style={canReview ? styles.button : styles.disabledButton}>
								Review
							</Button>
						</View>
					</View>
				);
			case 3:
				return (
					<View style={styles.buttonContainer}>
						<Button onPress={() => setFormSteps(1)} type="secondary" textColor="regular" style={styles.button}>
							Edit Details
						</Button>
						<Button onPress={handleProjectSubmit} style={styles.button}>
							Send
						</Button>
					</View>
				);
			default:
				return null;
		}
	};

	return (
		<Form {...form}>
			<SafeAreaView style={styles.container}>
				<StatusBar backgroundColor={theme.colors.backgroundDarkBlack} />
				{formSteps === 2 && isTalentSelectionGuideOpen && <BlurOverlay />}
				<View style={styles.header}>
					<Header name={headerText} />
					<ProjectStepsIndicator step={0} />
					<Text size="bodyBig" style={styles.subtitle} color="regular">
						{subTitle}
					</Text>
				</View>
				<ScrollView style={styles.body}>{renderStepContent()}</ScrollView>
				<View style={styles.footer}>{renderFooter()}</View>
			</SafeAreaView>
		</Form>
	);
}

export default NewProject;

const stylesheet = createStyleSheet(theme => ({
	container: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		flex: 1,
	},
	header: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		paddingBottom: theme.padding.base,
	},
	subtitle: {
		paddingHorizontal: theme.padding.base,
		opacity: 0.6,
		maxWidth: '90%',
		marginTop: theme.margins.base,
	},
	body: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		flex: 1,
	},
	footer: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		borderTopColor: theme.colors.borderGray,
		borderTopWidth: theme.borderWidth.slim,
		zIndex: 30,
	},
	buttonContainer: {
		width: '100%',
		borderColor: theme.colors.borderGray,
		borderTopWidth: theme.borderWidth.slim,
		flexDirection: 'row',
		paddingHorizontal: theme.padding.base,
	},
	button: {
		flexGrow: 1,
		minWidth: '40%',
		marginTop: theme.padding.xs,
		marginBottom: theme.margins.xxxl,
		borderColor: theme.colors.primary,
		borderWidth: theme.borderWidth.slim,
		textDecorationLine: 'none',
	},
	disabledButton: {
		backgroundColor: theme.colors.borderGray,
		flexGrow: 1,
		minWidth: '40%',
		marginTop: theme.padding.xs,
		marginBottom: theme.margins.xxxl,
		borderColor: theme.colors.borderGray,
		borderWidth: theme.borderWidth.slim,
		color: theme.colors.typographyLight,
	},
	errorText: {
		marginBottom: theme.margins.xs,
		textAlign: 'center',
	},
}));
