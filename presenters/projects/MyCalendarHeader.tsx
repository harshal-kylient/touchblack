import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ArrowLeft, ArrowRight } from '@touchblack/icons';
import { useStyles } from 'react-native-unistyles';

export default function MyCalendarHeader({ addMonth, month }: any) {
const { theme } = useStyles();
	const date = new Date(month);
	const monthYear = date.toLocaleString('en-US', {
		month: 'long',
		year: 'numeric',
	});

	return (
		<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: theme.margins.base }}>
			<TouchableOpacity onPress={() => addMonth(-1)} style={{ paddingHorizontal: theme.padding.base }}>
				<ArrowLeft size="28" />
			</TouchableOpacity>
			<Text style={{ fontSize: theme.fontSize.primaryH2,  color: 'white' }}>{monthYear}</Text>
			<TouchableOpacity onPress={() => addMonth(1)} style={{ paddingHorizontal: theme.padding.base}}>
				<ArrowRight size="28" />
			</TouchableOpacity>
		</View>
	);
}
