import React from 'react';
import { Pressable, View } from 'react-native';
import { createStyleSheet, UnistylesRuntime, useStyles } from 'react-native-unistyles';
import { Text } from '@touchblack/ui';

import { ICustomDayProps, IStatus } from '../useProjectCalendarLogic';
import EnumStatus from '@models/enums/EnumStatus';
import EnumProducerStatus from '@models/enums/EnumProducerStatus';
import { useOtherCalendarDayLogic } from './useOtherCalendarDayLogic';

export const OtherDay: React.FC<ICustomDayProps> = ({ talent_id, date, state, marking, onPress, height = 0 }) => {
	const { styles } = useStyles(stylesheet);
	const { isBlocked, status, projectCounts } = useOtherCalendarDayLogic(talent_id, date, marking);

	const isSelected = marking && marking.selected;
	const isToday = state === 'today';

	const typedStatus = status as IStatus | 'Both' | null;
	const shouldApplyBlockedStyling = isBlocked;
	const isPreviousDate = new Date(date.dateString) < new Date();

	const dayStyle = styles.dayStyle(isSelected, typedStatus, height, shouldApplyBlockedStyling);
	const textStyle = styles.textStyle(isPreviousDate, state, isSelected, isToday, typedStatus, shouldApplyBlockedStyling);

	const ProjectCount = ({ count, status, isBlocked }: { count: number; status: IStatus; isBlocked: boolean }) => {
		const { styles } = useStyles(stylesheet);
		if (count > 0) {
			return (
				<View style={styles.projectCountContainer(status)}>
					<Text size="inputLabel" style={styles.projectCountText}>
						{status !== EnumStatus.Blocked ? count : ''}
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
	dayStyle: (isSelected: boolean, status: IStatus | null | 'Both', height: number, shouldApplyBlockedStyling: boolean) => ({
		alignItems: 'center',
		justifyContent: 'space-between',
		flex: 1,
		backgroundColor: shouldApplyBlockedStyling ? '#55555533' : status === 'Both' ? `${theme.colors.destructive}30` : status === EnumProducerStatus.Completed ? `${theme.colors.verifiedBlue}30` : status === EnumProducerStatus.Live ? `${theme.colors.success}30` : status === EnumStatus.Tentative ? `${theme.colors.primary}30` : status === EnumStatus.Confirmed ? `${theme.colors.destructive}30` : status === EnumStatus.Enquiry ? `${theme.colors.success}30` : theme.colors.transparent,
		width: UnistylesRuntime.screen.width / 7,
		height: height,
		paddingTop: theme.padding.xxs,
	}),
	textStyle: (isPreviousDate: boolean, state: string, isSelected: boolean, isToday: boolean, status: IStatus | null | 'Both', shouldApplyBlockedStyling: boolean) => ({
		color: state === 'disabled' ? theme.colors.muted : status === EnumProducerStatus.Completed ? theme.colors.typography + '60' : status === EnumProducerStatus.Live ? theme.colors.typography + '60' : status === EnumStatus.Confirmed ? theme.colors.typography + '60' : status === EnumStatus.Enquiry ? theme.colors.typography + '60' : shouldApplyBlockedStyling ? '#555' : isSelected || isToday ? theme.colors.typography : isPreviousDate ? theme.colors.muted : theme.colors.typography,
		fontWeight: isToday ? theme.fontWeight.bold : theme.fontWeight.regular,
	}),
	projectTotalCountContainer: {
		flexDirection: 'column',
		alignItems: 'center',
		width: '100%',
	},
	projectCountContainer: (status: IStatus) => ({
		backgroundColor: status === EnumStatus.Tentative ? theme.colors.primary : status === EnumStatus.Blocked ? '#555' : status === EnumProducerStatus.Completed ? theme.colors.verifiedBlue : status === EnumProducerStatus.Live ? theme.colors.success : status === EnumStatus.Confirmed ? '#F56446' : status === EnumStatus.Enquiry ? theme.colors.success : theme.colors.muted,
		paddingVertical: theme.padding.xxxs,
		width: '100%',
		alignItems: 'center',
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		justifyContent: 'center',
	}),
	projectCountText: {
		color: theme.colors.black,
		fontSize: theme.fontSize.cardSubHeading,
		fontWeight: theme.fontWeight.bold,
	},
}));
