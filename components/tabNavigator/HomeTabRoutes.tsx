import { Search as SearchIcon, Home as HomeIcon, Bookmark, Mail, Project } from '@touchblack/icons';

import Home from '@presenters/Home';
import Search from '@presenters/search/Search';
import { blackOrWhite, primaryOrNone, primaryOrWhite } from '@utils/colorUtil';
import BlackBook from '@presenters/blackBook/BlackBook';
import Projects from '@presenters/projects/Projects';
import AllConversations from '@presenters/messages/other-chats/AllConversations';

export const routes = [
	{
		title: 'Home',
		icon: (active: boolean) => <HomeIcon color={primaryOrNone(active)} strokeWidth={3} size={active ? '28' : '24'} strokeColor={blackOrWhite(active)} />,
		component: Home,
		options: () => ({
			headerShown: false,
		}),
	},
	{
		title: 'Blackbook',
		icon: (active: boolean) => <Bookmark color={primaryOrNone(active)} size="24" strokeWidth={3} strokeColor={primaryOrWhite(active)} />,
		component: BlackBook,
		options: () => ({
			headerShown: false,
		}),
	},
	{
		title: 'Search',
		icon: (active: boolean) => <SearchIcon color={primaryOrWhite(active)} size="24" />,
		component: Search,
		options: () => ({
			headerShown: false,
		}),
	},
	{
		title: 'Projects',
		icon: (active: boolean) => <Project color={primaryOrWhite(active)} size="24" strokeWidth={1} />,
		component: Projects,
		options: () => ({
			headerShown: false,
		}),
	},
	{
		title: 'Messages',
		icon: (active: boolean) => <Mail color={primaryOrWhite(active)} size="24" />,
		component: AllConversations,
		options: () => ({
			headerShown: false,
		}),
	},
];
