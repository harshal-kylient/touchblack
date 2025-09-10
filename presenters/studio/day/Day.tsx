import React from 'react';
import { Pressable, View } from 'react-native';
import { createStyleSheet, UnistylesRuntime, useStyles } from 'react-native-unistyles';
import { Text } from '@touchblack/ui';

import { ICustomDay } from '@models/entities/ICustomDay';
import { useCalendarDayLogic } from './useCalendarDayLogic';
import EnumStudioStatus from '@models/enums/EnumStudioStatus';

export const Day: React.FC<ICustomDay> = ({ date, state, marking, onPress, height = 0 }) => {
	const { styles } = useStyles(stylesheet);
	const { isBlocked, status, projectCounts, userType } = useCalendarDayLogic(date, marking);

	const isSelected = marking && marking.selected;
	const isToday = state === 'today';
	const isPreviousDate = new Date(date.dateString) < new Date();

	const typedStatus = status as EnumStudioStatus | 'Both' | null;
	const shouldApplyBlockedStyling = isBlocked && userType !== 'Producer';

	const dayStyle = styles.dayStyle(isSelected, typedStatus, height, shouldApplyBlockedStyling);
	const textStyle = styles.textStyle(isPreviousDate, state, isSelected, isToday, typedStatus, shouldApplyBlockedStyling);

	const ProjectCount = ({ count, status, isBlocked }: { count: number; status: EnumStudioStatus; isBlocked: boolean }) => {
		const { styles } = useStyles(stylesheet);
		if (count > 0) {
			return (
				<View style={styles.projectCountContainer(status)}>
					<Text size="inputLabel" style={styles.projectCountText}>
						{status !== EnumStudioStatus['Not available'] && status !== EnumStudioStatus.Blocked ? count : ''}
					</Text>
				</View>
			);
		}
		return null;
	};

	return (
		<Pressable onPress={() => onPress(date)} style={dayStyle}>
			<Text size="secondary" style={textStyle}>
				{date.day}
			</Text>
			{
				<View style={styles.projectTotalCountContainer}>
					{projectCounts.map(({ count, status }, index) => (
						<ProjectCount key={`project-count-${index}`} count={count} status={status} isBlocked={isBlocked} />
					))}
				</View>
			}
		</Pressable>
	);
};

const stylesheet = createStyleSheet(theme => ({
	dayStyle: (isSelected: boolean, status: EnumStudioStatus | null | 'Both', height: number, shouldApplyBlockedStyling: boolean) => ({
		alignItems: 'center',
		justifyContent: 'space-between',
		flex: 1,
		backgroundColor: shouldApplyBlockedStyling
			? '#55555533'
			: status === 'Both'
			? `${theme.colors.success}30`
			: status === EnumStudioStatus['Not available']
			? '#55555533'
			: status === EnumStudioStatus.Blocked
			? '#55555533'
			: status === EnumStudioStatus.Completed
			? `${theme.colors.verifiedBlue}30`
			: status === EnumStudioStatus.Confirmed
			? `${theme.colors.destructive}30`
			: status === EnumStudioStatus.Tentative
			? `${theme.colors.primary}30`
			: status === EnumStudioStatus.Enquiry
			? `${theme.colors.success}30`
			: theme.colors.transparent,
		width: UnistylesRuntime.screen.width / 7,
		height: height,
		paddingTop: theme.padding.xxs,
	}),
	textStyle: (isPreviousDate: boolean, state: string, isSelected: boolean, isToday: boolean, status: EnumStudioStatus | null | 'Both', shouldApplyBlockedStyling: boolean) => ({
		color: state === 'disabled' ? theme.colors.borderGray : status === EnumStudioStatus.Completed ? theme.colors.typography : status === EnumStudioStatus.Enquiry ? theme.colors.typography : status === EnumStudioStatus.Confirmed ? theme.colors.typography : status === EnumStudioStatus.Tentative ? theme.colors.typography : shouldApplyBlockedStyling ? '#555' : isSelected || isToday ? theme.colors.typography : isPreviousDate ? theme.colors.muted : theme.colors.typography,
		fontWeight: isToday ? theme.fontWeight.bold : theme.fontWeight.regular,
	}),
	projectTotalCountContainer: {
		flexDirection: 'column',
		alignItems: 'center',
		width: '100%',
	},
	projectCountContainer: (status: EnumStudioStatus) => ({
		backgroundColor: status === EnumStudioStatus.Blocked ? '#555' : status === EnumStudioStatus.Confirmed ? theme.colors.destructive : status === EnumStudioStatus.Completed ? theme.colors.verifiedBlue : status === EnumStudioStatus.Tentative ? theme.colors.primary : status === EnumStudioStatus.Enquiry ? theme.colors.success : status === EnumStudioStatus['Not available'] ? '#555' : theme.colors.muted,
		paddingVertical: theme.padding.xxxs,
		width: '100%',
		alignItems: 'center',
		borderWidth: status === EnumStudioStatus.Blocked || status === EnumStudioStatus['Not available'] ? 0 : theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		justifyContent: 'center',
	}),
	projectCountText: {
		color: theme.colors.black,
		fontSize: theme.fontSize.cardSubHeading,
		fontWeight: theme.fontWeight.bold,
	},
}));
