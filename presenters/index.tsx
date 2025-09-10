import { NativeStackNavigationOptions, createNativeStackNavigator } from '@react-navigation/native-stack';
import { ParamListBase } from '@react-navigation/native';
import { darkTheme } from '@touchblack/ui/theme';

import Carousel from '@presenters/carousel/Carousel';
import PersonalDetails from '@presenters/auth/personalDetails/PersonalDetails';
import Login from '@presenters/login/Login';
import Signup from '@presenters/signup/Signup';
import TabNavigator from '@presenters/TabNavigator';
import RegisterUser from '@presenters/RegisterUser';
import Auth from '@presenters/auth/Auth';
import AccountSelect from '@presenters/auth/AccountSelect';
import Settings from '@presenters/Settings';
import Notifications from '@presenters/Notifications';
import Help from '@presenters/Help';
import PrivacyPolicy from '@presenters/PrivacyPolicy';
import TNC from '@presenters/tnc/TNC';
import About from '@presenters/about/About';
import BlockList from '@presenters/block/BlockList';
import ProducerProfile from '@presenters/producerProfile/ProducerProfile';
import { AuthStorage } from '@utils/storage';
import VideoPlayerScreen from '@presenters/videoPlayer/VideoPlayer';
import IFilm from '@models/entities/IFilm';
import BlackBookProfile from './blackBook/blackBookProfile/BlackBookProfile';
import ArchivedBlackBookList from './blackBook/ArchivedBlackBookList';
import { IBlackBookProfile } from '@models/entities/IBlackBookProfile';
import AadharOTP from './claim/AadharOTP/AadharOTP';
import AadharForm from './claim/AadharForm';
import ProfessionsList from '@components/drawerNavigator/professionsList/ProfessionsList';
import TalentListByProfession from '@components/drawerNavigator/TalentListByProfession/TalentListByProfession';
import RaiseClaim from './paymentClaim/RaiseClaim';

import MostViewedTalentList from './latestRelease/MostViewedTalentList';
import CreateProjectStep1 from './projects/create-project/CreateProjectStep1';
import CreateProjectStep2 from './projects/create-project/CreateProjectStep2';
import ProjectTalentSearch from './projects/create-project/ProjectTalentSearch';
import UpdateProducerProfile from '@components/sheets/updateProducerProfile/UpdateProducerProfile';
import UpdateTalentProfile from '@components/sheets/updateTalentProfile/UpdateTalentProfile';
import CreateProjectStep3 from './projects/create-project/CreateProjectStep3';
import useGetTalentDetails from '@network/useGetTalentDetails';
import { useAuth } from './auth/AuthContext';
import { SafeAreaView } from 'react-native';
import DiscoverTitlePlaceholder from '@components/loaders/DiscoverTitlePlaceholder';
import TextWithIconPlaceholder from '@components/loaders/TextWithIconPlaceholder';
import SmallGridPlaceholder from '@components/loaders/SmallGridPlaceholder';
import MediumGridPlaceholder from '@components/loaders/MediumGridPlaceholder';
import LargeGridPlaceholder from '@components/loaders/LargeGridPlaceholder';
import ProjectDetails from './projects/ProjectDetails';

import AddConversation from './messages/other-chats/AddConversation';
import ConversationScreen from './messages/other-chats/ConversationScreen';
import ProjectConversation from './messages/project-chats/ProjectConversation';
import AllConversations from './messages/other-chats/AllConversations';
import ProjectTalentsList from './messages/project-chats/ProjectTalentsList';
import Subscriptions from './subscriptions/Subscriptions';
import CancelSubscription from './subscriptions/CancelSubscription';
import StandardSubscription from './subscriptions/StandardSubscription';
import BillingHistory from './subscriptions/BillingHistory';

import GSTDetails from './gst/GSTDetails';
import GSTList from './gst/GSTList';
import ProjectCalendarView from './projects/ProjectCalendarView';
import DayWiseProjectCalendarView from './projects/DayWiseProjectCalendarView';
import BlackoutDates from './projects/BlackoutDates';
import ShowreelFilter from './talentProfile/Tabs/ShowreelFilter';
import EventsFilter from './events/EventsFilter'
import Invoices from './invoices/Invoices';
import PanCardDetails from './panCard/PanCardDetails';
import BankDetails from './bankDetails/BankDetails';
import UploadPOP from './invoices/pop/UploadPOP';
import InvoiceDetails from './invoices/invoiceDetails/InvoiceDetails';
import ProducerProjectsPerDayView from './projects/ProducerProjectsPerDayView';
import TalentProjectsPerDayView from './projects/TalentProjectsPerDayView';
import OtherTalentCalendarView from './projects/OtherTalentCalendarView';
import FullScreenVideoPlayer from './videoPlayer/FullScreenVideoPlayer';
import Welcome from './studio/welcome/Welcome';
import StudioHome from './studio/StudioHome';
import Bookings from './studio/Bookings';
import SelfBlock from './studio/SelfBlock';
import StudioBlackoutDates from './studio/blackoutDates/StudioBlackoutDates';
import StudioInvoices from './studio/StudioInvoices';
import StudioProfile from './studio/profile/StudioProfile';
import StudioDetails from './studio/StudioFloorDetails';
import PhotoGallery from './studio/components/PhotoGallery';
import Payments from './Payments';
import StudioWelcomPlaceholder from '@components/loaders/StudioWelcomPlaceholder';
import StudioTeamMembers from './studio/profile/team/StudioTeamMembers';
import StudioBookingStep1 from './studio/booking/StudioBookingStep1';
import StudioBookingStep2 from './studio/booking/StudioBookingStep2';
import StudioBookingStep3 from './studio/booking/StudioBookingStep3';
import StudioProjectsPerDayView from './studio/StudioProjectsPerDayView';
import StudioFilter from './studio/booking/StudioFilter';
import OtherStudioCalendarView from './studio/OtherStudioCalendarView';
import StudioConversation from './messages/project-chats/StudioConversation';
import StudioConversationsList from './studio/messages/StudioConversationsList';
import StudioNegotiation from '@components/sheets/studioNegotiation/StudioNegotiation';
import SessionExpired from './SessionExpired';
import EmailInput from './report/EmailInput';
import OtpInput from './report/OtpInput';
import ProducerTeamMembers from './producerProfile/ProducerTeamMembers';
import ReasonInput from './report/ReasonInput';
import ProducerFilmsFilter from './producerProfile/Tabs/ProducerFilmsFilter';
import AddFilm from '@components/sheets/addFilm/AddFilm';
import BlockDates from '@components/sheets/blockDates/BlockDates';
import LiveProjects from './projects/LiveProjects';
import BlackBook from './blackBook/BlackBook';
import LocationVideoList from './studio/components/LocationVideoList';
import TalentProfile from './talentProfile/TalentProfile';
import UserDetails from './userDetails/UserDetails';
import LoaderScreen from './loader/LoaderScreen';
import { Add } from '@touchblack/icons';
import AddYourEmail from './about/AddYourEmail';
import OtpValidation from './about/OtpValidation';
import StudioCounterNegotiation from './messages/project-chats/StudioCounterNegotiation';
import AssignManager from './assignManager/AssignManager';
import ManagerOtpValidation from './assignManager/ManagerOtpValidation';
import ChangeManager from './assignManager/ChangeManager';
import WelcomeManager from './assignManager/WelcomeManager';
import ManagerSettings from '@presenters/ManagerSettings';
import ManagerInvoices from './assignManager/ManagerInvoices';
import ManagerChats from './assignManager/ManagerChats';
import ManagerTalentSettings from './ManagerTalentSettings';
import GSTInDetails from './gst/GSTInDetail';
import Following from './Following';
import EventDetails from './events/EventsDetails';
import EventsList from './events/EventsList';
import AddToBlackBook from '@components/drawerNavigator/addToBlackBook/AddToBlackBook';
import KnownPerson from './talentProfile/KnowThisPerson';

export interface IMainStackParams extends ParamListBase {
	Home: undefined;
	Filter: undefined;
	ProducerProfile: undefined;
	TalentProfile: undefined;
	Carousel: undefined;
	Auth: undefined;
	AccountSelect: undefined;
	PersonalDetails: undefined;
	Login: undefined;
	Signup: undefined;
	TabNavigator: undefined;
	Register: undefined;
	Settings: undefined;
	Notifications: undefined;
	Help: undefined;
	PrivacyPolicy: undefined;
	TermsAndConditions: undefined;
	About: undefined;
	VideoPlayer: { film: IFilm };
	BlockList: undefined;
	BlackBookProfile: { blackBookData: IBlackBookProfile[]; mutateBlackBook: () => void };
	ArchivedBlackBook: undefined;
	TalentSelection: undefined;
	ProjectDetails: undefined;
	ProfessionsList: undefined;
	TalentListByProfession: undefined;
	RaiseClaim: undefined;
	AddConversation: undefined;
	AllConversation: undefined;
	Conversation: undefined;
	GSTDetails: undefined;
	GSTList: undefined;
	ProjectCalendarView: undefined;
	DayWiseProjectCalendarView: undefined;
	ShowreelFilter: undefined;
	EventsFilter: undefined;
	Invoices: undefined;
	PanCardDetails: undefined;
	BankDetails: undefined;
	UploadPOP: undefined;
	InvoiceDetails: undefined;
	SessionExpired: undefined;
	BlackoutDates: undefined;
	BlockTalentDates: undefined;
	LocationVideoList: undefined;
	UserDetails: undefined;
	LoaderScreen: undefined;
	AddYourEmail: undefined;
	OtpValidation: undefined;
	ChangeManager: undefined;
	WelcomeManager: undefined;
	ManagerSettings: undefined;
	ManagerInvoices: undefined;
	ManagerChats: undefined;
	ManagerTalentSettings: undefined;
	GSTInDetails: undefined;
	EventDetails: undefined;
	EventsList: undefined;
	AddToBlackBook: undefined;
	KnownPerson: undefined;
}

const Stack = createNativeStackNavigator<IMainStackParams>();

const stackNavigatorScreenOptions: NativeStackNavigationOptions = {
	headerTintColor: darkTheme.colors.typography,
	headerTitleStyle: {
		fontFamily: 'CabinetGrotesk-Regular',
		fontSize: darkTheme.fontSize.primaryH2,
	},
	headerStyle: { backgroundColor: darkTheme.colors.backgroundDarkBlack },
	headerShown: false,
	autoHideHomeIndicator: true,
	animation: 'slide_from_right',
};

export default function MainStackNavigator() {
	const { userId, loginType: userType, studioId, existingInstall } = useAuth();
	const { data: talentData, isLoading } = useGetTalentDetails(userId!);
	const firstName = talentData?.data?.first_name;
	const talentRole = talentData?.data?.talent_role;
	const currentScreen = userId && (!firstName || !talentRole) ? 'PersonalDetails' : userType === 'producer' ? 'TabNavigator' : userType === 'studio' && !existingInstall ? 'StudioWelcome' : userType === 'studio' && existingInstall ? 'TabNavigator' : userType === 'manager' ? 'TabNavigator' : userType === 'talent' ? 'TabNavigator' : AuthStorage.getBoolean('existing_install') ? 'Login' : 'Carousel';
	if (isLoading) {
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: darkTheme.colors.backgroundDarkBlack }}>
				{studioId ? (
					<StudioWelcomPlaceholder />
				) : (
					<>
						<DiscoverTitlePlaceholder />
						<TextWithIconPlaceholder />
						<SmallGridPlaceholder />
						<TextWithIconPlaceholder />
						<MediumGridPlaceholder />
						<TextWithIconPlaceholder />
						<LargeGridPlaceholder />
						<TextWithIconPlaceholder />
						<SmallGridPlaceholder />
					</>
				)}
			</SafeAreaView>
		);
	}

	return (
		<Stack.Navigator initialRouteName={currentScreen} screenOptions={stackNavigatorScreenOptions}>
			<Stack.Screen name="Carousel" component={Carousel} options={{ navigationBarColor: darkTheme.colors.backgroundLightBlack }} />
			<Stack.Screen name="Auth" component={Auth} />
			<Stack.Screen name="AccountSelect" component={AccountSelect} />
			<Stack.Screen name="PersonalDetails" component={PersonalDetails} />
			{/* <Stack.Screen name='ProducerSignupDetails' component={ProducerSignupDetails} /> */}
			<Stack.Screen name="Login" component={Login} />
			<Stack.Screen name="Signup" component={Signup} />
			<Stack.Screen name="TabNavigator" component={TabNavigator} options={{ navigationBarColor: darkTheme.colors.black }} />
			<Stack.Screen name="Register" component={RegisterUser} />
			<Stack.Screen name="ProducerProfile" component={ProducerProfile} />
			<Stack.Screen name="Settings" component={Settings} />
			<Stack.Screen name="Notifications" component={Notifications} />
			<Stack.Screen name="Help" component={Help} />
			<Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
			<Stack.Screen name="TermsAndConditions" component={TNC} />
			<Stack.Screen name="About" component={About} />
			<Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
			<Stack.Screen name="BlockList" component={BlockList} />
			<Stack.Screen name="BlackBookProfile" component={BlackBookProfile} />
			<Stack.Screen name="ArchivedBlackBook" component={ArchivedBlackBookList} />
			<Stack.Screen name="ClaimAccount" component={AadharForm} />
			<Stack.Screen name="AadharOTP" component={AadharOTP} />
			<Stack.Screen name="ProfessionsList" component={ProfessionsList} />
			<Stack.Screen name="TalentListByProfession" component={TalentListByProfession} />
			<Stack.Screen name="AddConversation" component={AddConversation} />
			<Stack.Screen name="RaiseClaim" component={RaiseClaim} />
			<Stack.Screen name="AllConversation" component={AllConversations} />
			<Stack.Screen name="MostViewedTalentList" component={MostViewedTalentList} />
			<Stack.Screen name="Conversation" component={ConversationScreen} />
			<Stack.Screen name="ProjectConversation" component={ProjectConversation} />
			<Stack.Screen name="CreateProjectStep1" component={CreateProjectStep1} />
			<Stack.Screen name="CreateProjectStep2" component={CreateProjectStep2} />
			<Stack.Screen name="CreateProjectStep3" component={CreateProjectStep3} />
			<Stack.Screen name="ProjectTalentSearch" component={ProjectTalentSearch} />
			<Stack.Screen name="UpdateTalentProfile" component={UpdateTalentProfile} />
			<Stack.Screen name="UpdateProducerProfile" component={UpdateProducerProfile} />
			<Stack.Screen name="ProjectDetails" component={ProjectDetails} />
			<Stack.Screen name="ProjectTalentsList" component={ProjectTalentsList} />
			<Stack.Screen name="ProducerProjectsPerDayView" component={ProducerProjectsPerDayView} />
			<Stack.Screen name="TalentProjectsPerDayView" component={TalentProjectsPerDayView} />
			<Stack.Screen name="OtherTalentCalendarView" component={OtherTalentCalendarView} />
			<Stack.Screen name="FullScreenVideoPlayer" component={FullScreenVideoPlayer} />
			<Stack.Screen name="ProjectCalendarView" component={ProjectCalendarView} />
			<Stack.Screen name="DayWiseProjectCalendarView" component={DayWiseProjectCalendarView} />
			<Stack.Screen name="BlackoutDates" component={BlackoutDates} />
			<Stack.Screen name="GSTDetails" component={GSTDetails} />
			<Stack.Screen name="GSTList" component={GSTList} />
			<Stack.Screen name="ShowreelFilter" component={ShowreelFilter} />
			<Stack.Screen name="EventsFilter" component={EventsFilter} />
			<Stack.Screen name="Invoices" component={Invoices} />
			<Stack.Screen name="PanCardDetails" component={PanCardDetails} />
			<Stack.Screen name="BankDetails" component={BankDetails} />
			<Stack.Screen name="UploadPOP" component={UploadPOP} />
			<Stack.Screen name="InvoiceDetails" component={InvoiceDetails} />
			<Stack.Screen name="StudioWelcome" component={Welcome} />
			<Stack.Screen name="StudioHome" component={StudioHome} />
			<Stack.Screen name="Bookings" component={Bookings} />
			<Stack.Screen name="SelfBlock" component={SelfBlock} />
			<Stack.Screen name="StudioBlackoutDates" component={StudioBlackoutDates} />
			<Stack.Screen name="StudioInvoices" component={StudioInvoices} />
			<Stack.Screen name="StudioProfile" component={StudioProfile} />
			<Stack.Screen name="StudioDetails" component={StudioDetails} />
			<Stack.Screen name="PhotoGallery" component={PhotoGallery} />
			<Stack.Screen name="Payments" component={Payments} />
			<Stack.Screen name="StudioTeamMembers" component={StudioTeamMembers} />
			<Stack.Screen name="StudioBookingStep1" component={StudioBookingStep1} />
			<Stack.Screen name="StudioBookingStep2" component={StudioBookingStep2} />
			<Stack.Screen name="StudioBookingStep3" component={StudioBookingStep3} />
			<Stack.Screen name="StudioConversationsList" component={StudioConversationsList} />
			<Stack.Screen name="StudioProjectsPerDayView" component={StudioProjectsPerDayView} />
			<Stack.Screen name="StudioFilter" component={StudioFilter} />
			<Stack.Screen name="OtherStudioCalendarView" component={OtherStudioCalendarView} />
			<Stack.Screen name="StudioConversation" component={StudioConversation} />
			<Stack.Screen name="StudioNegotiation" component={StudioNegotiation} />
			<Stack.Screen name="SessionExpired" component={SessionExpired} />
			<Stack.Screen name="EmailInput" component={EmailInput} />
			<Stack.Screen name="OtpInput" component={OtpInput} />
			<Stack.Screen name="ReasonInput" component={ReasonInput} />
			<Stack.Screen name="ProducerTeamMembers" component={ProducerTeamMembers} />
			<Stack.Screen name="ProducerFilmsFilter" component={ProducerFilmsFilter} />
			<Stack.Screen name="AddFilm" component={AddFilm} />
			<Stack.Screen name="BlockTalentDates" component={BlockDates} />
			<Stack.Screen name="LiveProjects" component={LiveProjects} />
			<Stack.Screen name="Blackbook" component={BlackBook} />
			<Stack.Screen name="LocationVideoList" component={LocationVideoList} />
			<Stack.Screen name="TalentProfile" component={TalentProfile} />
			<Stack.Screen name="Following" component={Following} />
			<Stack.Screen name="UserDetails" component={UserDetails} />
			<Stack.Screen name="LoaderScreen" component={LoaderScreen} />
			<Stack.Screen name="AddYourEmail" component={AddYourEmail} />
			<Stack.Screen name="OtpValidation" component={OtpValidation} />
			<Stack.Screen name="Subscriptions" component={Subscriptions} />
			<Stack.Screen name="CancelSubscription" component={CancelSubscription} />
			<Stack.Screen name="StandardSubscription" component={StandardSubscription} />
			<Stack.Screen name="BillingHistory" component={BillingHistory} />
			<Stack.Screen name="StudioCounterNegotiation" component={StudioCounterNegotiation} />
			<Stack.Screen name="AssignManager" component={AssignManager} />
			<Stack.Screen name="ManagerOtpValidation" component={ManagerOtpValidation} />
			<Stack.Screen name="ChangeManager" component={ChangeManager} />
			<Stack.Screen name="WelcomeManager" component={WelcomeManager} />
			<Stack.Screen name="ManagerSettings" component={ManagerSettings} />
			<Stack.Screen name="ManagerInvoices" component={ManagerInvoices} />
			<Stack.Screen name="ManagerChats" component={ManagerChats} />
			<Stack.Screen name="ManagerTalentSettings" component={ManagerTalentSettings} />
			<Stack.Screen name="GSTInDetails" component={GSTInDetails} />
			<Stack.Screen name="EventDetails" component={EventDetails} />
			<Stack.Screen name="EventsList" component={EventsList} />
			<Stack.Screen name="AddToBlackBook" component={AddToBlackBook} />
			<Stack.Screen name="KnownPerson" component={KnownPerson} />
		</Stack.Navigator>
	);
}
