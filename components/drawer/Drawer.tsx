import { ReactNode, useMemo } from 'react';
import { View, Platform } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import ActionSheet from 'react-native-actions-sheet';

import ProfileVerifiedSheet from '@components/sheets/profileVerifiedSheet/ProfileVerifiedSheet';
import ProfileExistingSheet from '@components/sheets/profileExistingSheet/ProfileExistingSheet';
import ProfileVerifyingSheet from '@components/sheets/profileVerifyingSheet/ProfileVerifyingSheet';
import EditProfilePictureSheet from '@components/sheets/editProfilePictureSheet/EditProfilePictureSheet';
import SwitchProfileSheet from '@components/sheets/switchProfileSheet/SwitchProfileSheet';
import ReportIssueSheet from '@components/sheets/reportIssueSheet/ReportIssueSheet';
import AddTeamMemberSheet from '@components/sheets/addTeamMemberSheet/AddTeamMemberSheet';
import Success from '@components/sheets/success/Success';
import RemoveTeamMemberSheet from '@components/sheets/removeTeamMemberSheet/RemoveTeamMemberSheet';
import Report from '@components/sheets/report/Report';
import Block from '@components/sheets/block/Block';
import Unblock from '@components/sheets/unblock/Unblock';
import { SheetType } from 'sheets.tsx';
import DeleteAccount from '@components/sheets/deleteAccount/DeleteAccount';
import UnarchiveTalentSheet from '@components/sheets/unarchive/UnarchiveTalent';
import UnFollowUserSheet from '@components/sheets/unFollowUser/UnFollowUser';
import UnlikeFilm from '@components/sheets/unlikeFilm/UnlikeFilmSheet';
import FilmOptions from '@components/sheets/filmOptions/FilmOptions';
import PinFilm from '@components/sheets/pinFilm/PinFilm';
import HideFilm from '@components/sheets/hideFilm/HideFilm';
import EditFilm from '@components/sheets/editFilm/EditFilm';
import NotificationOptions from '@components/sheets/notificationOptions/NotificationOptions';
import DeleteNotification from '@components/sheets/deleteNotification/DeleteNotification';
import DeleteSheet from '@components/sheets/delete/DeleteSheet';
import Negotiation from '@components/sheets/negotiation/Negotiation';
import CounterOffer from '@components/sheets/counterOffer/CounterOffer';
import BlockDates from '@components/sheets/blockDates/BlockDates';
import DeleteGST from '@components/sheets/deleteGST/DeleteGST';
import OptOut from '@components/sheets/optOut/OtpOut';
import FilterInvoices from '@components/sheets/filterInvoices/FilterInvoices';
import ReviseClaim from '@components/sheets/reviseClaim/ReviseClaim';
import CancelStudioBooking from '@components/sheets/cancelBooking/CancelStudioBooking';
import StudioTeamMemberManagement from '@components/sheets/studioTeamMemberManagement/StudioTeamMemberManagement';
import ProducerTeamMemberManagement from '@components/sheets/studioTeamMemberManagement/ProducerTeamMemberManagement';
import StudioRequest from '@components/sheets/studioRequest/StudioRequest';
import CancelBlackout from '@components/sheets/cancelBlackout/CancelBlackout';
import StudioOptOut from '@components/sheets/studioOptOut/StudioOptOut';
import StudioCounterOffer from '@components/sheets/studioCounterOffer/StudioCounterOffer';
import AddOtherFilm from '@components/sheets/addOtherFilm/AddOtherFilm';
import SubscriptionPopup from '@components/sheets/subscription/SubscriptionPopup';
import CancelSubscriptionPopup from '@components/sheets/subscription/CancelSubscriptionPopup';
import RestartSubscriptionPopup from '@components/sheets/subscription/RestartSubscriptionPopup';
import SubscriptionConfirmationPopup from '@components/sheets/subscription/SubscriptionConfirmationPopup';
import SubscriptionRestrictionPopup from '@components/sheets/subscription/SubscriptionRestrictionPopUp';
import RenewNowPopup from '@components/sheets/subscription/RenewNowPopup';
import ManagerSuccessPopup from '@presenters/assignManager/ManagerSuccessPopup';
import RemoveManagerPopup from '@presenters/assignManager/RemoveManagerPopup';
import RemoveMyFavorites from '@components/sheets/removeFromFavorites/RemoveMyFavorites';
import ProjectCreationPopup from '@presenters/projects/create-project/ProjectCreationPopup';
import KnowThisPersonSheet from '@components/sheets/knowThisPerson/KnowThisPersonSheet';

interface Payload {
	sheet: SheetType;
	data: any;
	onSheetClose?: () => void;
}

type DrawerProps = {
	children?: ReactNode;
	payload?: Payload;
};

// Showing and hiding the drawer is handled via sheetManager (check sheets.tsx)
// https://rnas.vercel.app/guides/sheetmanager
function Drawer(props: DrawerProps) {
	const { styles } = useStyles(stylesheet);
	const activeSheet = props.payload?.sheet;
	const data = props.payload?.data;
	const onSheetClose = props.payload?.onSheetClose;

	const DrawerHeader = useMemo(
		() => (
			<View style={styles.drawerHeader}>
				<View style={[styles.drawerHeaderKnob, Platform.OS === 'android' && { backgroundColor: '#FFFFFF', opacity: 0.8 }]} />
			</View>
		),
		[styles.drawerHeader, styles.drawerHeaderKnob],
	);

	const renderSheet = useMemo(() => {
		switch (activeSheet) {
			case SheetType.ProfileVerified:
				return <ProfileVerifiedSheet />;
			case SheetType.ProfileExisting:
				return <ProfileExistingSheet />;
			case SheetType.ProfileVerifying:
				return <ProfileVerifyingSheet />;
			case SheetType.EditProfilePicture:
				return <EditProfilePictureSheet onSuccess={data?.onSuccess} />;
			case SheetType.SwitchProfile:
				return <SwitchProfileSheet data={data} />;
			case SheetType.ReportIssue:
				return <ReportIssueSheet />;
			case SheetType.AddTeamMember:
				return <AddTeamMemberSheet data={data} />;
			case SheetType.AddOtherFilm:
				return <AddOtherFilm onSuccess={data?.onSuccess} />;
			case SheetType.Success:
				return <Success icon={data?.icon} header={data.header} text={data.text} onPress={data.onPress} onPressText={data.onPressText} />;
			case SheetType.RemoveTeamMember:
				return <RemoveTeamMemberSheet data={data} />;
			case SheetType.Report:
				return <Report reportedId={data?.reportedId} reporterId={data?.reporterId} reportedType={data?.reportedType} reporterType={data.reporterType} />;
			case SheetType.Block:
				return <Block blocked_id={data?.blocked_id} blocked_type={data?.blocked_type} onSuccess={data?.onSuccess} />;
			case SheetType.Unblock:
				return <Unblock name={data?.name} blocked_id={data?.blocked_id} onSuccess={data?.onSuccess} />;
			case SheetType.DeleteAccount:
				return <DeleteAccount />;
			case SheetType.UnlikeFilm:
				return <UnlikeFilm film_ids={data?.film_ids} film_name={data?.film_name} blackbook_id={data?.blackbook_id} />;
			case SheetType.UnarchiveTalent:
				return <UnarchiveTalentSheet item={data?.item} />;
			case SheetType.RemoveMyFavorites:
				return <RemoveMyFavorites item={data?.item} />;
			case SheetType.UnFollowUserSheet:
				return <UnFollowUserSheet user_id={data?.user_id} user_name={data?.user_name} />;
			case SheetType.FilmOptions:
				return <FilmOptions type={data.type} film={data.film} onSuccess={data.onSuccess} />;
			case SheetType.PinFilm:
				return <PinFilm type={data.type} film={data.film} />;
			case SheetType.EditFilm:
				return <EditFilm type={data?.type} film={data?.film} onSuccess={data.onSuccess} />;
			case SheetType.HideFilm:
				return <HideFilm type={data?.type} film={data?.film} onSuccess={data.onSuccess} />;
			case SheetType.NotificationOptions:
				return <NotificationOptions id={data?.id} />;
			case SheetType.DeleteNotification:
				return <DeleteNotification id={data?.id} />;
			case SheetType.Delete:
				return <DeleteSheet text={data?.text} header={data?.header} onDismiss={data?.onDismiss} onDelete={data?.onDelete} />;
			case SheetType.Negotiation:
				return <Negotiation project_name={data?.project_name} conversation_id={data?.conversation_id} onSuccess={data?.onSuccess} />;
			case SheetType.CounterOffer:
				return <CounterOffer negotiation_id={data?.negotiation_id} sender_name={data?.sender_name} comments={data?.comments} cancellation_charges={data?.cancellation_charges} payment_terms={data?.payment_terms} gst_applicable={data?.gst_applicable} conversation_id={data?.conversation_id} amount={data?.amount} onSuccess={data?.onSuccess} />;
			case SheetType.OptOut:
				return <OptOut invitation_id={data?.invitation_id} conversation_id={data?.conversation_id} onSuccess={data?.onSuccess} />;
			case SheetType.BlockDates:
				return <BlockDates payload={data} />;
			case SheetType.DeleteGST:
				return <DeleteGST gst_id={data?.gst_id} role={data?.role} />;
			case SheetType.SortInvoices:
				return <FilterInvoices />;
			case SheetType.ReviseClaim:
				return <ReviseClaim negotiation_id={data?.negotiation_id} sender_name={data?.sender_name} comments={data?.comments} cancellation_charges={data?.cancellation_charges} payment_terms={data?.payment_terms} gst_applicable={data?.gst_applicable} conversation_id={data?.conversation_id} amount={data?.amount} onSuccess={data?.onSuccess} />;
			case SheetType.CancelStudioBooking:
				return <CancelStudioBooking booking_id={data?.booking_id} header={data?.header} text={data?.text} />;
			case SheetType.StudioTeamMemberManagement:
				return <StudioTeamMemberManagement userId={data?.userId} isNewMember={data?.isNewMember} userName={data?.userName} userRole={data?.userRole} profilePictureUrl={data?.profilePictureUrl} />;
			case SheetType.ProducerTeamMemberManagement:
				return <ProducerTeamMemberManagement userId={data?.userId} isNewMember={data?.isNewMember} userName={data?.userName} userRole={data?.userRole} profilePictureUrl={data?.profilePictureUrl} />;
			case SheetType.StudioRequest:
				return <StudioRequest header={data?.header} text={data?.text} onPress={data?.onPress} onPressText={data?.onPressText} />;
			case SheetType.CancelBlackout:
				return <CancelBlackout startTime={data?.startTime} endTime={data?.endTime} startDate={data?.startDate} endDate={data?.endDate} notes={data?.notes} title={data?.title} reason={data?.reason} />;
			case SheetType.StudioOptOut:
				return <StudioOptOut conversation_id={data?.conversation_id} booking_id={data?.booking_id} onSuccess={data?.onSuccess} />;
			case SheetType.StudioCounterOffer:
				return (
					<StudioCounterOffer
						services={data?.services}
						terms_and_conditions_url={data?.terms_and_conditions_url}
						advance_amount={data?.advance_amount}
						hours={data?.hours}
						days={data?.days}
						amount={data?.amount}
						negotiation_id={data?.negotiation_id}
						sender_name={data?.sender_name}
						comments={data?.comments}
						cancellation_charges={data?.cancellation_charges}
						payment_terms={data?.payment_terms}
						gst_applicable={data?.gst_applicable}
						conversation_id={data?.conversation_id}
						onSuccess={data?.onSuccess}
					/>
				);
			case SheetType.SubscriptionPopup:
				return <SubscriptionPopup data={data} />;
			case SheetType.CancelSubscriptionPopup:
				return <CancelSubscriptionPopup data={data} />;
			case SheetType.RestartSubscriptionPopup:
				return <RestartSubscriptionPopup data={data} />;
			case SheetType.SubscriptionConfirmationPopup:
				return <SubscriptionConfirmationPopup data={data} />;
			case SheetType.SubscriptionRestrictionPopup:
				return <SubscriptionRestrictionPopup data={data} />;
			case SheetType.RenewNowPopup:
				return <RenewNowPopup status={data?.subscriptionStatus} id={data?.subscriptionId} />;
			case SheetType.DateTimePicker:
				return <DateTimePicker />;
			case SheetType.ManagerSuccessPopup:
				return <ManagerSuccessPopup data={data} />;
			case SheetType.RemoveManagerPopup:
				return <RemoveManagerPopup data={data} />;
			case SheetType.ProjectCreationPopup:
				return <ProjectCreationPopup data={data} />;
			case SheetType.KnowThisPersonSheet:
				return <KnowThisPersonSheet talentAbout={data.talentAbout} id={data.id} />;
			default:
				return null;
		}
	}, [activeSheet, data]);

	return (
		<ActionSheet
			CustomHeaderComponent={DrawerHeader}
			headerAlwaysVisible={true}
			gestureEnabled={false}
			onClose={() => {
				if (typeof onSheetClose === 'function') {
					onSheetClose();
				}
			}}
			// Critical Android positioning fixes
			useBottomSafeAreaPadding={false}
			statusBarTranslucent={false}
			drawUnderStatusBar={false}
			closeOnPressBack={true}
			closeOnTouchBackdrop={true}
			// Animation settings - optimized for Android speed
			animated={true}
			initialOffsetFromBottom={Platform.OS === 'android' ? 0 : 1}
			springOffset={Platform.OS === 'android' ? 0 : 50}
			bounciness={Platform.OS === 'android' ? 0 : 4}
			// Android performance optimizations
			isModal={Platform.OS === 'android' ? false : true}
			closable={true}
			// Speed up Android animations
			velocityThreshold={Platform.OS === 'android' ? 0.3 : 0.5}
			directionalDistanceChangeThreshold={Platform.OS === 'android' ? 0.25 : 0.5}
			// Container styling
			containerStyle={Platform.OS === 'android' ? styles.androidContainer : styles.actionSheetContainer}
			overlayStyle={Platform.OS === 'android' ? styles.androidOverlay : styles.overlayStyle}
			// Disable native driver for Android (causes delays in 0.9.7)
			useNativeDriver={Platform.OS === 'ios'}>
			<View style={styles.contentContainer}>{renderSheet}</View>
		</ActionSheet>
	);
}

export { Drawer, type DrawerProps };

const stylesheet = createStyleSheet(theme => ({
	actionSheetContainer: {
		backgroundColor: theme.colors.backgroundLightBlack,
		borderTopLeftRadius: 16,
		borderTopRightRadius: 16,
	},
	// Android-specific container fixes to prevent fullscreen
	androidContainer: {
		backgroundColor: theme.colors.backgroundLightBlack,
		borderTopLeftRadius: 16,
		borderTopRightRadius: 16,
		// Prevent fullscreen behavior
		height: 'auto',
		maxHeight: '70%',
		minHeight: 200,
		// Position at bottom
		alignSelf: 'flex-end',
		width: '100%',
		// Remove absolute positioning that causes fullscreen
		position: 'relative',
		// Proper margins
		marginTop: 'auto',
		marginBottom: 0,
		marginLeft: 0,
		marginRight: 0,
		// Remove conflicting styles
		top: 'auto',
		bottom: 0,
		left: 'auto',
		right: 'auto',
		zIndex: 999,
		elevation: 8,
	},
	overlayStyle: {
		backgroundColor: 'rgba(0, 0, 0, 0.4)',
	},
	// Separate Android overlay to ensure proper backdrop
	androidOverlay: {
		backgroundColor: 'rgba(0, 0, 0, 0.4)',
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'stretch',
	},
	drawerHeader: {
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.typographyLight,
		backgroundColor: theme.colors.backgroundLightBlack,
		paddingVertical: 12,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		borderTopLeftRadius: 16,
		borderTopRightRadius: 16,
	},
	drawerHeaderKnob: {
		backgroundColor: 'white',
		height: 2,
		width: 28,
		borderRadius: 1,
	},
	contentContainer: {
		backgroundColor: theme.colors.backgroundLightBlack,
		// Prevent content from expanding fullscreen on Android
		maxHeight: Platform.OS === 'android' ? 600 : '100%',
		paddingBottom: Platform.OS === 'android' ? 35 : 0,
	},
}));
