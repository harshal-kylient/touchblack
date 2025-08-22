import { ScrollView } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import TalentRoleFilter from './TalentRoleFilter/TalentRoleFilter';
import WorkedWithFilter from './WorkedWithFilter/WorkedWithFilter';
import TypesOfFilmsFilter from './TypesOfFilmsFilter/TypesOfFilmsFilter';
import IndustryFilter from './IndustryFilter/IndustryFilter';
import BrandsFilter from './BrandsFilter/BrandsFilter';
import LanguageFilter from './LanguageFilter/LanguageFilter';
import DurationFilter from './DurationFilter/DurationFilter';
import YearOfReleaseFilter from './YearOfReleaseFilter/YearOfReleaseFilter';
import EducationFilter from './EducationFilter/EducationFilter';
import HomeLocationFilter from './HomeLocationFilter/HomeLocationFilter';
import AwardsFilter from './AwardsFilter/AwardsFilter';
import { useFilterContext } from './FilterContext';
import getCurrentFilter from './getCurrentFilter';

function FilterBody() {
	const { styles } = useStyles(stylesheet);
	const { state, dispatch } = useFilterContext();
	const talentTab = state.activeTab === 0;
	const filmTab = state.activeTab === 1;
	const producerTab = state.activeTab === 2;

	return (
		<KeyboardAwareScrollView style={styles.scrollContainer}>
			{talentTab ? (
				<>
					<TalentRoleFilter />
					<WorkedWithFilter />
					<TypesOfFilmsFilter state={state[getCurrentFilter(state.activeTab)]} dispatch={dispatch} />
					<BrandsFilter state={state[getCurrentFilter(state.activeTab)]} dispatch={dispatch} />
					<IndustryFilter state={state[getCurrentFilter(state.activeTab)]} dispatch={dispatch} />
					<YearOfReleaseFilter state={state[getCurrentFilter(state.activeTab)]} dispatch={dispatch} />
					<HomeLocationFilter />
					<DurationFilter state={state[getCurrentFilter(state.activeTab)]} dispatch={dispatch} />
					<LanguageFilter state={state[getCurrentFilter(state.activeTab)]} dispatch={dispatch} />
					<EducationFilter />
					<AwardsFilter />
				</>
			) : filmTab || producerTab ? (
				<>
					<TypesOfFilmsFilter state={state[getCurrentFilter(state.activeTab)]} dispatch={dispatch} />
					<BrandsFilter state={state[getCurrentFilter(state.activeTab)]} dispatch={dispatch} />
					<IndustryFilter state={state[getCurrentFilter(state.activeTab)]} dispatch={dispatch} />
					{/*<GenreFilter />*/}
					<LanguageFilter state={state[getCurrentFilter(state.activeTab)]} dispatch={dispatch} />
					<YearOfReleaseFilter state={state[getCurrentFilter(state.activeTab)]} dispatch={dispatch} />
					<DurationFilter state={state[getCurrentFilter(state.activeTab)]} dispatch={dispatch} />
				</>
			) : null}
		</KeyboardAwareScrollView>
	);
}

export default FilterBody;

const stylesheet = createStyleSheet(theme => ({
	scrollContainer: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		flex: 1,
		marginBottom: theme.padding.xxl,
	},
}));
