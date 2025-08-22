import { MMKV } from 'react-native-mmkv';

const AuthStorage = new MMKV({
	id: 'auth-storage',
	encryptionKey: 'encryptionkey',
});

const SearchStorage = new MMKV({
	id: 'search-storage',
	encryptionKey: 'encryptionkey',
});

const ProjectStorage = new MMKV({
	id: 'project-storage',
	encryptionKey: 'encryptionkey',
});

const UrlStorage = new MMKV({
	id: 'url-storage',
	encryptionKey: 'encryptionkey',
});

const StudioStorage = new MMKV({
	id: 'studio-storage',
	encryptionKey: 'encryptionkey',
});

const TalentManagerStorage = new MMKV({
	id: 'talent-manager-storage',
	encryptionKey: 'encryptionkey',
});

const EventsFilterStorage = new MMKV({
	id: 'events-filter-storage',
	encryptionKey: 'encryptionkey',
});

export { AuthStorage, SearchStorage, ProjectStorage, UrlStorage, StudioStorage, TalentManagerStorage, EventsFilterStorage };
