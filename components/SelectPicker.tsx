import { View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface IProps {
	items: any[];
	placeholder?: string;
	value: any;
	onChange: (item: any) => void;
	style?: any;
	disabled?: boolean;
}

export default function SelectPicker({ items, placeholder, value, onChange, style, disabled = false, ...props }: IProps) {
	const { styles, theme } = useStyles(stylesheet);
	const placeholderText = placeholder || 'Select an item';

	return (
		<View style={[styles.container, style, disabled && styles.disabledContainer]} {...props}>
			<Picker
				selectedValue={value?.value || ''}
				onValueChange={itemValue => {
					if (!disabled) {
						const selectedItem = items.find(item => item.value === itemValue);
						onChange(selectedItem || null);
					}
				}}
				style={[styles.picker, disabled && styles.disabledPicker]}
				dropdownIconColor={disabled ? theme.colors.muted : theme.colors.typography}
				enabled={!disabled}>
				<Picker.Item label={placeholderText} value="" color={theme.colors.muted} />
				{items.map((item, index) => (
					<Picker.Item key={index} label={item.name} value={item.value} color={disabled ? theme.colors.muted : theme.colors.typography} />
				))}
			</Picker>
		</View>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		backgroundColor: theme.colors.destructive,
	},
	disabledContainer: {
		opacity: 0.5,
	},
	picker: {
		color: theme.colors.typography,
	},
	disabledPicker: {
		color: theme.colors.muted,
	},
}));
