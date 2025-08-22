import EnumProducerStatus from '@models/enums/EnumProducerStatus';
import EnumStatus from '@models/enums/EnumStatus';
import EnumStudioStatus from '@models/enums/EnumStudioStatus';
import { darkTheme as theme } from '@touchblack/ui/theme';

export function getStudioCalendarBackgroundColor(status: EnumStudioStatus) {
	return status === EnumStudioStatus.Confirmed ? '#F56446' : status === EnumStudioStatus.Completed ? theme.colors.verifiedBlue : status === EnumStudioStatus.Tentative ? theme.colors.primary : status === EnumStudioStatus.Enquiry ? theme.colors.success : status === EnumStudioStatus['Not available'] ? '#555' : theme.colors.muted;
}

export function getStudioCalendarPerDayColor(event: { status: EnumStudioStatus }) {
	return event.status === EnumStudioStatus.Enquiry ? '#50483b55' : event.status === EnumStudioStatus.Confirmed ? '#25332355' : event.status === EnumStudioStatus.Completed ? '#19213E55' : event.status === EnumStudioStatus.Tentative ? '#3C1F1955' : '#28282855';
}

export function getStudioTimelineCalendarColor(status: EnumStudioStatus) {
	return status === EnumStudioStatus.Enquiry ? '#25332355' : status === EnumStudioStatus.Confirmed ? '#3C1F1955' : status === EnumStudioStatus.Completed ? '#19213E55' : status === EnumStudioStatus.Tentative ? '#50483b55' : '#28282855';
}

export function getTalentTimelineCalendarColor(status: EnumStatus) {
	return status === EnumStatus.Enquiry ? '#25332355' : status === EnumStatus.Confirmed ? '#3C1F1955' : status === EnumStatus.Tentative ? '#50483b55' : '#28282855';
}

export function getStudioCalendarPerDayBackgroundColor(status: EnumStudioStatus) {
	return status === EnumStudioStatus.Enquiry ? theme.colors.success : status === EnumStudioStatus.Confirmed ? theme.colors.destructive : status === EnumStudioStatus.Completed ? theme.colors.verifiedBlue : status === EnumStudioStatus.Tentative ? theme.colors.primary : '#555555';
}

export function getTalentCalendarPerDayBackgroundColor(status: EnumStatus) {
	return status === EnumStatus.Enquiry ? theme.colors.success : status === EnumStatus.Confirmed ? theme.colors.destructive : status === EnumStatus.Tentative ? theme.colors.primary : '#555555';
}

export function getStudioDayBackgroundColor(shouldApplyBlockedStyling: boolean, status: EnumStudioStatus | 'Both') {
	return shouldApplyBlockedStyling
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
		: theme.colors.transparent;
}

export function getStudioDayTextColor(state: string, isSelected: boolean, isToday: boolean, status: EnumStudioStatus | null | 'Both', shouldApplyBlockedStyling: boolean) {
	return state === 'disabled' ? theme.colors.borderGray : status === EnumStudioStatus.Completed ? theme.colors.typography : status === EnumStudioStatus.Enquiry ? theme.colors.typography : status === EnumStudioStatus.Confirmed ? theme.colors.typography : status === EnumStudioStatus.Tentative ? theme.colors.typography : shouldApplyBlockedStyling ? '#555' : isSelected || isToday ? theme.colors.typography : theme.colors.typography;
}

export function getStudioDayProjectCountBackgroundColor(status: EnumStudioStatus) {
	return status === EnumStudioStatus.Blocked ? '#555' : status === EnumStudioStatus.Confirmed ? theme.colors.destructive : status === EnumStudioStatus.Completed ? theme.colors.verifiedBlue : status === EnumStudioStatus.Tentative ? theme.colors.primary : status === EnumStudioStatus.Enquiry ? theme.colors.success : status === EnumStudioStatus['Not available'] ? '#555' : theme.colors.muted;
}

// Project
export function getProjectCalendarBackgroundColor(status: EnumStatus) {
	return status === 'Confirmed' ? theme.colors.success : status === 'Enquiry' ? theme.colors.primary : status === 'Blackout' ? '#50483b' : status === 'Completed' ? theme.colors.primary : status === 'Ongoing' ? theme.colors.success : theme.colors.muted;
}

export function getProjectDayWiseCalendarBackgroundColor(status: EnumStatus) {
	return status === 'Confirmed' ? theme.colors.success : status === 'Enquiry' ? theme.colors.primary : status === 'Blackout' ? theme.colors.muted : status === 'Completed' ? theme.colors.primary : status === 'Ongoing' ? theme.colors.success : 'transparent';
}

export function getProducerProjectPerDayViewBackgroundColor(status: EnumProducerStatus) {
	return status === 'Confirmed' ? theme.colors.success : status === 'Enquiry' ? theme.colors.primary : status === 'Blocked' ? theme.colors.muted : status === 'Completed' ? theme.colors.primary : status === 'Ongoing' ? theme.colors.success : 'transparent';
}

export function getTalentProjectPerDayViewBackgroundColor(key: EnumStatus) {
	return key === EnumProducerStatus.Live || key === EnumStatus.Confirmed ? '#F56446' : key === EnumStatus.Tentative ? theme.colors.primary : key === EnumProducerStatus.Completed || key === EnumStatus.Enquiry ? theme.colors.success : theme.colors.borderGray;
}

export function getTalentProjectPerDayViewDotBackgroundColor(status: EnumStatus) {
	return status === 'Confirmed' ? '#F56446' : status === 'Enquiry' ? theme.colors.success : status === 'Blackout' ? theme.colors.muted : status === 'Completed' ? theme.colors.primary : status === 'Ongoing' ? theme.colors.success : 'transparent';
}

export function getTalentCalendarBackgroundColor(status: EnumStatus) {
	return status === EnumStatus.Tentative ? theme.colors.primary : status === 'Confirmed' ? '#F56446' : status === 'Enquiry' ? theme.colors.success : status === 'Blackout' ? theme.colors.muted : theme.colors.muted;
}
