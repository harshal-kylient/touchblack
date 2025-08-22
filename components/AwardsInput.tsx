import { TouchableOpacity, View } from 'react-native';
import { ControllerRenderProps, FieldValues, FormState, useFieldArray, useFormContext } from 'react-hook-form';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text, TextInput } from '@touchblack/ui';

interface IAwardsInputProps {
	field: ControllerRenderProps<FieldValues, string>;
	serverError: string | null;
	formState: FormState<FieldValues>;
	setServerError: React.Dispatch<React.SetStateAction<string | null>>;
}

export function AwardsInput({ field, serverError, formState }: IAwardsInputProps) {
	const { styles, theme } = useStyles(stylesheet);
	const { control, setValue } = useFormContext();
	const { remove } = useFieldArray({ control, name: 'awards' });

	const awards = [{ awardName: '', year: '', filmName: '' }];

	return (
		<View>
			{/* Render existing award entries */}
			{awards.map((award, index) => (
				<View style={styles.container} key={index}>
					<TextInput style={styles.textinput(serverError, formState, field)} value={award.awardName} onChangeText={text => setValue(`awards[${index}].filmName`, text)} placeholder="Film Name" placeholderTextColor={theme.colors.typographyLight} />
					<TextInput style={styles.textinput(serverError, formState, field)} value={award.year} onChangeText={text => setValue(`awards[${index}].year`, text)} placeholder="Year" placeholderTextColor={theme.colors.typographyLight} />
					<TextInput style={styles.textinput(serverError, formState, field)} value={award.filmName} onChangeText={text => setValue(`awards[${index}].year`, text)} placeholder="Year" placeholderTextColor={theme.colors.typographyLight} />
					<TouchableOpacity onPress={() => remove(index)}>
						<Text size="cardSubHeading" style={styles.destructive}>
							Remove
						</Text>
					</TouchableOpacity>
				</View>
			))}
		</View>
	);
}

const stylesheet = createStyleSheet(theme => ({
	textinput: (serverError, formState, field) => ({
		borderWidth: theme.borderWidth.slim,
		color: theme.colors.typography,
		backgroundColor: theme.colors.black,
		fontFamily: 'CabinetGrotesk-Regular',
		paddingHorizontal: 10,
		borderColor: serverError || formState.errors[field.name] ? theme.colors.destructive : theme.colors.borderGray,
	}),
	container: {
		gap: theme.gap.xxs,
		marginBottom: theme.padding.xxl,
	},
	destructive: { color: theme.colors.destructive },
}));
