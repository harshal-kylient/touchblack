import { Text } from '@touchblack/ui';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Control, Controller, UseFormGetValues, UseFormSetValue } from 'react-hook-form';
import CheckBox from '@components/Checkbox';
import useProducerPermissionsList from '@network/useProducerPermissionsList';
import { useEffect, useState } from 'react';

interface IProps {
	control: Control;
	permissions: string[];
	setValue: UseFormSetValue<any>;
	getValues: UseFormGetValues<any>;
}

function handleFullAccess(type: '::View' | '::Edit', onChange: (value: boolean) => void, val: boolean, data: {}, setValue: UseFormSetValue<any>) {
	onChange(val);
	Object.entries(data).map(([key]) => {
		setValue(key + type, val);
	});
}

function handleAccessChange(type: '::View' | '::Edit', key: string, onChange: (value: boolean) => void, val: boolean, data: {}, getValues: UseFormGetValues<any>, setValue: UseFormSetValue<any>) {
	onChange(val);
	const changeFullAccess = (value: boolean) => setValue('FullAccess' + type, value);

	if (getValues(key + '::Edit')) {
		setValue(key + '::View', true);
	}

	for (let [key, value] of Object.entries(data)) {
		if (!getValues(key + type)) {
			changeFullAccess(false);
			return;
		}
	}
	changeFullAccess(true);
}

export const ProducerPermissionsList = ({ setValue, control, getValues }: IProps) => {
	const { styles } = useStyles(stylesheet);
	const { data: response } = useProducerPermissionsList();
	const [data, setData] = useState({});
	useEffect(() => {
		response?.forEach(it => {
			if (it?.name?.split(':')[0] === 'Calendar') return;
			setData(prev => ({ ...prev, [it?.name?.split(':')[0]]: it?.name }));
		});
	}, [response]);

	return (
		<>
			<View style={[styles.subContainer(0, Object.keys(data).length)]}>
				<View style={styles.cardContainer}>
					<View style={styles.card}>
						<Text color="regular" weight="regular" size="primarySm">
							Full Access
						</Text>
					</View>
					<View style={styles.checkboxContainer}>
						<Controller control={control} name={'FullAccess' + '::View'} render={({ field: { onChange, value: formValue } }) => <CheckBox value={formValue} onChange={val => handleFullAccess('::View', onChange, val, data, setValue)} />} />
						<Controller control={control} name={'FullAccess' + '::Edit'} render={({ field: { onChange, value: formValue } }) => <CheckBox value={formValue} onChange={val => handleFullAccess('::Edit', onChange, val, data, setValue)} />} />
					</View>
				</View>
			</View>
			{Object.entries(data).map(([key, value], index, array) => (
				<View key={key} style={[styles.subContainer(index + 1, array.length + 1)]}>
					<View style={styles.cardContainer}>
						<View style={styles.card}>
							<Text color="regular" weight="regular" size="primarySm">
								{key}
							</Text>
						</View>
						<View style={styles.checkboxContainer}>
							<Controller control={control} name={key + '::View'} render={({ field: { onChange, value: formValue } }) => <CheckBox value={formValue} onChange={val => handleAccessChange('::View', key, onChange, val, data, getValues, setValue)} />} />
							<Controller control={control} name={key + '::Edit'} render={({ field: { onChange, value: formValue } }) => <CheckBox value={formValue} onChange={val => handleAccessChange('::Edit', key, onChange, val, data, getValues, setValue)} />} />
						</View>
					</View>
				</View>
			))}
		</>
	);
};

const stylesheet = createStyleSheet(theme => ({
	subContainer: (index, totalLength) => ({
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		borderBottomWidth: index === totalLength - 1 ? theme.borderWidth.bold : theme.borderWidth.none,
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
