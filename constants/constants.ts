import { Dimensions } from 'react-native';
import endpoints from './endpoints';
import routes from './routes';
import { UrlStorage } from '@utils/storage';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const currentYear = new Date().getFullYear();
const WEB_URL = 'https://dev.d28b040nwkqruf.amplifyapp.com';
const INTERNAL = true;
const DOMAIN = UrlStorage.getString('url') ? UrlStorage.getString('url') : INTERNAL ? 'https://test.talentgridnow.com' : 'https://api.talentgridnow.com';
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

const GENDER = [
	{
		id: 'Male',
		name: 'Male',
	},
	{
		id: 'Female',
		name: 'Female',
	},
	{
		id: 'Gender Neutral',
		name: 'Gender Neutral',
	},
	{
		id: 'Not Selected',
		name: 'Not Selected',
	},
];

const PRODUCER_PERMISSIONS = {
	CALENDAR_VIEW: 'Calendar::View',
	CALENDAR_EDIT: 'Calendar::Edit',
	MESSAGES_VIEW: 'Messages::View',
	MESSAGES_EDIT: 'Messages::Edit',
};

const STUDIO_PERMISSIONS = {
	CALENDAR_VIEW: 'Calendar::View',
	CALENDAR_EDIT: 'Calendar::Edit',
	MESSAGES_VIEW: 'Messages::View',
	MESSAGES_EDIT: 'Messages::Edit',
};

const PROOF_TYPE = {
	PAN_CARD: 'PAN',
	AADHAR_CARD: 'Aadhar',
};

const SUBSCRIPTION_TYPES = {
	TRIAL_ACTIVE: 'trial_active',
	TRIAL_ENDED: 'trial_ended',
	CANCELLED_ACTIVE: 'cancelled_active',
	CANCELLED_ENDED: 'cancelled_ended',
	GRACE_PERIOD_ACTIVE: 'grace_period_active',
	GRACE_PERIOD_ENDED: 'grace_period_ended',
	REGULAR_ACTIVE: 'regular_active',
};
const POPUP_TYPES = {
	SEARCH: 'search',
	CALENDAR: 'calendar',
	MAILBOX_PROJECTS_CHATS: 'mailbox_project_chats',
	PROJECT: 'project',
	PROFILE_ADD_FILM: 'profile_add_film',
	PROFILE_VIEW_FILM: 'profile_view_film',
	PROFILE_ADD_OTHER_FILM: 'profile_add_other_film',
	PROFILE_SELF_SHARE: 'profile_self_share',
	PROFILE_OTHER_SHARE: 'profile_other_share',
	CLAIM_ACCOUNT: 'claim_account',
	NOTIFICATIONS: 'notifications',
	SHOWREEL_MANAGEMENT: 'showreel_management',
	ASSIGN_MANAGER: 'assign_manager',
	CHANGE_MANAGER: 'change_manager',
	MANAGER_TALENT_ACCESS: 'manager_talent_access',
};
export const SUBSCRIPTION_STATUS_POPUP_CONTENT = {
	success: {
		title: "You're all set!",
		message: 'Welcome again! Your next project starts here.',
		buttonText: "Let's go",
	},
	failed: {
		title: 'Payment Failed – Try Again!',
		message: 'It looks like your payment didn’t go through. To continue enjoying premium features, please retry your payment or choose a different method.',
		buttonText: 'Retry',
	},
};

const MONTHS = [
	{ name: 'January', value: '1' },
	{ name: 'February', value: '2' },
	{ name: 'March', value: '3' },
	{ name: 'April', value: '4' },
	{ name: 'May', value: '5' },
	{ name: 'June', value: '6' },
	{ name: 'July', value: '7' },
	{ name: 'August', value: '8' },
	{ name: 'September', value: '9' },
	{ name: 'October', value: '10' },
	{ name: 'November', value: '11' },
	{ name: 'December', value: '12' },
];

const YEARS = Array.from({ length: 25 }, (_, i) => ({
	name: (currentYear - i).toString(),
	value: (currentYear - i).toString(),
}));

const enLocaleCalendarConfig = {
	monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	dayNamesShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
	today: 'Today',
};

const TABLE_DATA = [
	['Setup', '1000', '20', '20000'],
	['Dismantle', '1000', '20', '20000'],
	['Location Rental', '1000', '20', '20000'],
	['Staff Charges', '1000', '20', '20000'],
	['Deposit', '1000', '20', '20000'],
	['Makeup Room', '1000', '20', '20000'],
	['Property', '1000', '20', '20000'],
	['Electricity', '1000', '20', '20000'],
];
const PRICING_DATA = [['No. of Days', '25', '30', '120']];

const CONSTANTS = {
	INDIA_ID: '1e0f1fa4-3b41-48fe-942f-a4142e92eb67',
	INTERNAL,
	endpoints,
	GENDER,
	routes,
	WEB_URL,
	screenWidth: width,
	screenHeight: height,
	enLocaleCalendarConfig,
	MIN_DURATION: 5,
	MAX_DRUATION: 2 * 60,
	MIN_STUDIO_RATE: 1000,
	MAX_STUDIO_RATE: 100_000_000,
	MIN_STUDIO_HEIGHT: 2,
	MAX_STUDIO_HEIGHT: 100_000,
	MIN_STUDIO_AREA: 200,
	MAX_STUDIO_AREA: 200_000_000,
	MIN_RATE: 1000,
	MAX_RATE: 20_00_000,
	MIN_RELEASE_YEAR: 2010,
	MAX_RELEASE_YEAR: currentYear,
	MAX_FILE_SIZE: 5 * 1024 * 1024,
	DOMAIN,
	BASE_URL: `${DOMAIN}/api/v1/`,
	BASE_URL_V2: `${DOMAIN}/api/v2/`,
	PRIVACY_POLICY_URL: 'https://talentgridnow.com/privacy-policy',
	TERMS_CONDITIONS_URL: 'https://talentgridnow.com/terms-and-conditions',
	MONTHS,
	YEARS,
	PROOF_TYPE,
	SUBSCRIPTION_TYPES,
	POPUP_TYPES,
	SUBSCRIPTION_STATUS_POPUP_CONTENT,
	PAN_REGEX,
	STUDIO_PERMISSIONS,
	TABLE_DATA,
	PRICING_DATA,
};

export default CONSTANTS;
