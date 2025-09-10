import { Pressable, View } from 'react-native';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import { Button, Text } from '@touchblack/ui';
import { useState } from 'react';
import { Close } from '@touchblack/icons';
import CONSTANTS from '@constants/constants';
import { useQueryClient } from '@tanstack/react-query';
import server from '@utils/axios';
import { SheetManager } from 'react-native-actions-sheet';
import { useAuth } from '@presenters/auth/AuthContext';
import { useTalentContext } from '@presenters/assignManager/ManagerTalentContext';

interface IProps {
	startDate: string;
	endDate: string;
	startTime: string;
	endTime: string;
	notes: string;
	title: string;
	reason: string;
}

const width = CONSTANTS.screenWidth;

export default function CancelBlackout({ startDate, endDate, startTime, endTime, notes, title, reason }: IProps) {
	const { styles, theme } = useStyles(stylesheet);
	const queryClient = useQueryClient();
	const [message, setMessage] = useState('');
	const { selectedTalent } = useTalentContext();
	const { loginType } = useAuth();
	const talent_id = selectedTalent?.talent?.user_id;

	async function handlePress() {
		let url = CONSTANTS.endpoints.delete_talent_blocked_dates(startDate, endDate, startTime, endTime, title, reason);

		if (loginType === 'manager') {
			url += `&talent_id=${talent_id}`;
		}
		const res = await server.delete(url);
		if (res.data?.success) {
			queryClient.invalidateQueries(['useGetBlackoutDates', String(new Date().getFullYear())]);
			SheetManager.hide('Drawer');
		} else setMessage(res.data?.message);
	}

	return (
		<View style={styles.container}>
			{/* Content Start */}
			<View style={styles.iconContainer}>
				<View style={{ backgroundColor: theme.colors.destructive, width: width / 4 - 16, height: width / 4 - 16, position: 'absolute', borderRadius: 400 }}></View>
				<Close color={theme.colors.black} size={`${width / 5}`} />
			</View>
			<View style={styles.contentContainer}>
				<Text color="regular" size="primaryMid" style={styles.regularFontFamily}>
					Cancel Blackout!
				</Text>
				<Text color="muted" size="bodyBig" style={styles.regularFontFamily}>
					Are you sure you want to cancel Blackout?
				</Text>
			</View>
			{/* Content End */}
			{/* Buttons Start */}
			<View style={styles.buttonContainer}>
				{message ? (
					<Pressable onPress={() => setMessage('')} style={{ position: 'absolute', bottom: 80, left: 0, right: 0, padding: theme.padding.xs, backgroundColor: theme.colors.black, borderTopWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
						<Text color={'error'} textAlign="center" size="bodyBig">
							{message}
						</Text>
					</Pressable>
				) : null}
				<View style={{ flexDirection: 'row', minWidth: '100%' }}>
					<Button style={{ flex: 1, borderWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }} type="secondary" textColor="regular" onPress={() => SheetManager.hide('Drawer')}>
						No
					</Button>
					<Button style={{ flex: 1 }} onPress={handlePress}>
						Yes
					</Button>
				</View>
			</View>
			{/* Buttons End */}
		</View>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		width: '100%',
		bottom: 16,
		justifyContent: 'center',
		alignItems: 'center',
	},
	contentContainer: {
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		gap: theme.gap.sm,
		padding: theme.padding.base,
		alignSelf: 'stretch',
	},
	calendarHeader: {
		paddingHorizontal: theme.padding.base,
		paddingTop: theme.padding.base,
		gap: theme.gap.xxs,
	},
	buttonContainer: {
		borderTopWidth: theme.borderWidth.bold,
		borderColor: theme.colors.borderGray,
		alignSelf: 'stretch',
		padding: theme.padding.base,
	},
	buttonCancel: {
		flexGrow: 1,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	buttonSubmit: {
		flexGrow: 1,
	},
	dayStyle: (isSelected: boolean) => ({
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: isSelected ? '#50483b' : 'transparent',
		width: UnistylesRuntime.screen.width / 7,
		height: UnistylesRuntime.screen.width / 7,
	}),
	textStyle: (state: string, isSelected: boolean, isToday: boolean) => ({
		color: state === 'disabled' ? theme.colors.muted : isSelected || isToday ? theme.colors.typography : theme.colors.muted,
		fontWeight: isToday ? theme.fontWeight.bold : theme.fontWeight.regular,
	}),
	iconContainer: {
		width: width / 3,
		height: width / 3,
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		justifyContent: 'center',
		alignItems: 'center',
	},
	regularFontFamily: {
		fontFamily: 'CabinetGrotesk-Regular',
		textAlign: 'center',
	},
}));
