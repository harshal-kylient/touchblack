export default function getCurrentFilter(activeTab: number) {
	return activeTab === 0 ? 'talentFilters' : activeTab === 1 ? 'filmFilters' : 'producerFilters';
}
