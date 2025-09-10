import { registerSheet, SheetDefinition } from 'react-native-actions-sheet';

import { Drawer } from '@components/drawer/Drawer';

export enum SheetType {
	ProfileVerified = 'ProfileVerifiedSheet',
	ProfileExisting = 'ProfileExistingSheet',
	ProfileVerifying = 'ProfileVerifyingSheet',
	EditProfilePicture = 'EditProfilePictureSheet',
	SwitchProfile = 'SwitchProfileSheet',
	ReportIssue = 'ReportIssueSheet',
	UpdateProducerProfile = 'UpdateProducerProfileSheet',
	UpdateTalentProfile = 'UpdateTalentProfileSheet',
	AddOtherFilm = 'AddOtherFilm',
	Success = 'Success',
	AddTeamMember = 'AddTeamMemberSheet',
	RemoveTeamMember = 'RemoveTeamMemberSheet',
	Report = 'Report',
	Block = 'Block',
	Unblock = 'Unblock',
	DeleteAccount = 'DeleteAccount',
	UnlikeFilm = 'UnlikeFilmSheet',
	UnarchiveTalent = 'UnarchiveTalentSheet',
	RemoveMyFavorites = 'RemoveMyFavorites',
	FilmOptions = 'FilmOptions',
	EditFilm = 'EditFilm',
	PinFilm = 'PinFilm',
	HideFilm = 'HideFilm',
	NotificationOptions = 'NotificationOptions',
	DeleteNotification = 'DeleteNotification',
	Calendar = 'Calendar',
	Delete = 'Delete',
	Negotiation = 'Negotiation',
	CounterOffer = 'CounterOffer',
	OptOut = 'OptOut',
	BlockDates = 'BlockDates',
	DeleteGST = 'DeleteGST',
	SortInvoices = 'SortInvoices',
	ReviseClaim = 'ReviseClaim',
	CancelStudioBooking = 'CancelStudioBooking',
	// DatePicker = 'DatePicker',
	StudioTeamMemberManagement = 'StudioTeamMemberManagement',
	ProducerTeamMemberManagement = 'ProducerTeamMemberManagement',
	StudioRequest = 'StudioRequest',
	CancelBlackout = 'CancelBlackout',
	StudioOptOut = 'StudioOptOut',
	StudioNegotiation = 'StudioNegotiation',
	StudioReviseClaim = 'StudioReviseClaim',
	StudioCounterOffer = 'StudioCounterOffer',
	DateTimePicker = 'DateTimePicker',
	SubscriptionPopup = 'SubscriptionPopup',
	CancelSubscriptionPopup = 'CancelSubscriptionPopup',
	RestartSubscriptionPopup = 'RestartSubscriptionPopup',
	SubscriptionRestrictionPopup = 'SubscriptionRestrictionPopup',
	RenewNowPopup = 'RenewNowPopup',
	SubscriptionConfirmationPopup = 'SubscriptionConfirmationPopup',
	ManagerSuccessPopup = 'ManagerSuccessPopup',
	RemoveManagerPopup = 'RemoveManagerPopup',
	UnFollowUserSheet = 'UnFollowUserSheet',
	ProjectCreationPopup = 'ProjectCreationPopup',
	KnowThisPersonSheet = 'KnowThisPersonSheet',
}

registerSheet('Drawer', Drawer);

declare module 'react-native-actions-sheet' {
	interface Sheets {
		Drawer: SheetDefinition<{
			payload: {
				sheet: SheetType;
				data?: any;
			};
		}>;
	}
}

export {};
