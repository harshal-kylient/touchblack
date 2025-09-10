import { memo } from 'react';
import { FieldErrors } from 'react-hook-form';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { FormField, FormItem, FormLabel, FormControl, FormMessage, TextInput } from '@touchblack/ui';

import Select from './Select';
import { ViewStyle } from 'react-native';

interface FormFieldWrapperProps {
	name: string;
	label?: string | React.ReactNode;
	disabled?: boolean;
	control: any;
	placeholder: string;
	multiline?: boolean;
	numberOfLines?: number;
	keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad' | 'decimal-pad';
	onChangeText?: (value: string) => void;
	errors: FieldErrors;
	type?: 'text' | 'select';
	items?: Array<{ id: string; name: string }>;
	onSearch?: (query: string) => void;
	style?: ViewStyle;
	onLoadMore?: () => void;
}

const FormFieldWrapper = memo(({ name, label, disabled = false, control, placeholder, multiline = false, numberOfLines = 1, keyboardType = 'default', onChangeText, errors, type = 'text', items = [], style }: FormFieldWrapperProps) => {
	const { styles, theme } = useStyles(stylesheet);

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem style={[styles.formItem, style]}>
					{label && <FormLabel style={styles.formLabel}>{label}</FormLabel>}
					<FormControl>
						{type === 'text' && (
							<TextInput
								keyboardType={keyboardType}
								onChangeText={value => {
									field.onChange(value);
									if (onChangeText) {
										onChangeText(value);
									}
								}}
								editable={!disabled}
								placeholder={placeholder}
								value={field.value?.toString() ?? ''}
								placeholderTextColor={theme.colors.typographyLight}
								multiline={multiline}
								numberOfLines={numberOfLines}
								style={[
									styles.textinput,
									styles.inputPadding,
									multiline && styles.multilineTextInput,
									{
										borderColor: errors[name] ? theme.colors.destructive : theme.colors.borderGray,
									},
								]}
							/>
						)}
						{type === 'select' && <Select items={items} value={field.value} onChange={value => field.onChange(value)} placeholder={placeholder} itemsToShow={4} style={styles.select} />}
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
});

const stylesheet = createStyleSheet(theme => ({
	formItem: {
		marginHorizontal: theme.margins.base,
		gap: theme.gap.xxs,
	},
	formLabel: {
		opacity: 0.8,
	},
	textinput: {
		borderWidth: theme.borderWidth.slim,
		color: theme.colors.typography,
		backgroundColor: theme.colors.black,
		fontFamily: 'CabinetGrotesk-Regular',
	},
	inputPadding: {
		flexGrow: 1,
		paddingHorizontal: 10,
	},
	multilineTextInput: {
		textAlignVertical: 'top',
		paddingTop: theme.padding.xs,
		minHeight: 70,
	},
	select: {
		backgroundColor: theme.colors.black,
	},
}));

export default FormFieldWrapper;
