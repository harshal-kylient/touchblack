import { useState } from 'react';
import { View } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@touchblack/ui';
import { ArrowDown } from '@touchblack/icons';

interface IDropDownDataItem {
	name?: string;
	film_name?: string;
	id?: string;
	film_id?: string;
}

interface ISelectDropDownProps {
	data?: IDropDownDataItem[];
	onSelect?: (selectedItem: IDropDownDataItem) => void;
	placeholder: string;
	defaultValue?: string;
}

const transformProfessionsData = (data: IDropDownDataItem[]) => {
	return data.map((item: IDropDownDataItem) => ({
		title: item.name ? item.name : item.film_name,
		id: item.id ? item.id : item.film_id,
	}));
};

function SelectDropDown({ data = [], onSelect, placeholder, defaultValue }: ISelectDropDownProps) {
	const { styles } = useStyles(stylesheet);
	const transformedData = transformProfessionsData(data);

	const [selectedItem, setSelectedItem] = useState<IDropDownDataItem | undefined>(transformedData.find((item: IDropDownDataItem) => item.id == defaultValue));

	return (
		<SelectDropdown
			data={transformedData}
			onSelect={item => {
				setSelectedItem(item);
				if (onSelect) {
					onSelect(item);
				}
			}}
			defaultValue={selectedItem}
			renderButton={selectedItem => {
				return (
					<View style={styles.dropdownButtonStyle}>
						<Text size="bodyMid" style={styles.dropdownButtonTextStyle(selectedItem)}>
							{(selectedItem && selectedItem.title) || placeholder}
						</Text>
						<ArrowDown size="24" />
					</View>
				);
			}}
			renderItem={(item, isSelected) => {
				return (
					<View style={styles.dropdownItemStyle(isSelected)}>
						<Text size="primaryBig" color="muted" style={styles.dropdownItemTextStyle}>
							{item.title}
						</Text>
					</View>
				);
			}}
			showsVerticalScrollIndicator={false}
			dropdownStyle={styles.dropdownMenuStyle}
		/>
	);
}

const stylesheet = createStyleSheet(theme => ({
	dropdownButtonStyle: {
		width: '100%',
		height: 56,
		backgroundColor: theme.colors.black,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		borderRadius: 0,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: theme.padding.xs,
	},
	dropdownMenuStyle: {
		backgroundColor: theme.colors.backgroundLightBlack,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	dropdownItemStyle: isSelected => ({
		width: '100%',
		flexDirection: 'row',
		padding: theme.padding.base,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		justifyContent: 'center',
		alignItems: 'center',
		...(isSelected && {
			backgroundColor: theme.colors.backgroundLightBlack,
		}),
	}),
	dropdownButtonTextStyle: selectedItem => ({
		color: selectedItem ? theme.colors.typography : theme.colors.borderGray,
		flex: 1,
	}),
	dropdownItemTextStyle: {
		flex: 1,
		fontSize: theme.fontSize.title,
	},
}));

export default SelectDropDown;
