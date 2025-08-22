import { useState } from 'react';
import { ControllerRenderProps, FieldValues, FormState } from 'react-hook-form';
import { View, TextInput } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { OnlineAssistant } from '@touchblack/icons';

interface IDateTimeProps {
	field: ControllerRenderProps<FieldValues, string>;
	serverError: string | null;
	formState: FormState<FieldValues>;
	setServerError: React.Dispatch<React.SetStateAction<string | null>>;
}

const DateInput = ({ field, serverError, formState, setServerError }: IDateTimeProps) => {
	const [open, setOpen] = useState(false);
	const { styles, theme } = useStyles(stylesheet);

	const handleDateChange = (selectedDate: Date) => {
		const formattedDate = selectedDate.toISOString().split('T')[0];
		field.onChange(formattedDate);
	};

	return (
		<View style={styles.DateTimeContainer}>
			<TextInput
				onPressIn={() => setOpen(true)}
				value={field.value}
				onChangeText={v => {
					setServerError('');
					field.onChange(v);
				}}
				placeholder="Please enter your date of birth"
				placeholderTextColor={theme.colors.typographyLight}
				style={styles.textinput(serverError, formState, field)}
			/>
			<OnlineAssistant size="40" />
			<DatePicker
				modal
				open={open}
				mode="date"
				date={new Date(field.value)}
				onConfirm={selectedDate => {
					setOpen(false);
					handleDateChange(selectedDate);
				}}
				onCancel={() => {
					setOpen(false);
				}}
			/>
		</View>
	);
};

const stylesheet = createStyleSheet(theme => ({
	DateTimeContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%',
		height: 60,
		alignItems: 'center',
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		paddingHorizontal: 10,
		backgroundColor: theme.colors.black,
	},
	textinput: (serverError: any, formState: any, field: any) => ({
		fontFamily: 'CabinetGrotesk-Regular',
		flex: 1,
		borderColor: serverError || formState.errors[field.name] ? theme.colors.destructive : theme.colors.borderGray,
	}),
}));

export default DateInput;
