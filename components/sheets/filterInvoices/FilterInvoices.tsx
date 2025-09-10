import { memo } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Button, Text, Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@touchblack/ui';

import { Radio, RadioFilled } from '@touchblack/icons';
import SearchInput from '@components/SearchInput';
import CONSTANTS from '@constants/constants';
import useFilterInvoicesLogic from './useFilterInvoicesLogic';
import SelectPicker from '@components/SelectPicker';

const FilterInvoices = memo(() => {
	const { styles, theme } = useStyles(stylesheet);
	const { selectedFilterType, filteredProjectId, projectSearchQuery, form, filteredProjects, handleMonthSortSelect, handleProjectSortSelect, handleProjectSelect, setProjectSearchQuery, handleReset, onSubmit } = useFilterInvoicesLogic();

	return (
		<ScrollView style={styles.container}>
			<View style={styles.header}>
				<Text color="regular" size="primaryMid">
					Filter by:
				</Text>
			</View>
			<Form {...form}>
				<View style={styles.body}>
					<View style={styles.filterContainer(selectedFilterType === 'month')}>
						<Pressable onPress={handleMonthSortSelect} style={styles.filterItem}>
							{selectedFilterType === 'month' ? <RadioFilled size="24" color={theme.colors.primary} /> : <Radio size="24" color={theme.colors.muted} />}
							<Text size="secondary" color={selectedFilterType === 'month' ? 'regular' : 'muted'}>
								Month
							</Text>
						</Pressable>
						<View style={styles.monthFilter}>
							<FormField
								control={form.control}
								name="month"
								render={({ field }) => (
									<FormItem style={styles.monthFilterItem}>
										<FormControl>
											<SelectPicker items={CONSTANTS.MONTHS} value={field.value} onChange={value => field.onChange(value)} placeholder="mm" style={styles.select} disabled={selectedFilterType !== 'month'} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="year"
								render={({ field }) => (
									<FormItem style={styles.monthFilterItem}>
										<FormControl>
											<SelectPicker items={CONSTANTS.YEARS} value={field.value} onChange={value => field.onChange(value)} placeholder="yy" style={styles.select} disabled={selectedFilterType !== 'month'} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</View>
					</View>
					<View style={[styles.filterContainer(selectedFilterType === 'project'), styles.projectFilterContainer]}>
						<Pressable onPress={handleProjectSortSelect} style={styles.filterItem}>
							{selectedFilterType === 'project' ? <RadioFilled size="24" color={theme.colors.primary} /> : <Radio size="24" color={theme.colors.muted} />}
							<Text size="secondary" color={selectedFilterType === 'project' ? 'regular' : 'muted'}>
								Project
							</Text>
						</Pressable>
						<SearchInput searchQuery={projectSearchQuery} setSearchQuery={setProjectSearchQuery} placeholderText="Search Projects..." editable={selectedFilterType === 'project'} />
						<View style={styles.projectFilter}>
							{filteredProjects.length === 0 ? (
								<View style={styles.emptyContainer}>
									<Text size="bodyMid" color="muted">
										No such projects found
									</Text>
								</View>
							) : (
								filteredProjects.map(project => (
									<Pressable onPress={() => handleProjectSelect(project)} style={styles.projectFilterItemMarginContainer} key={project.id} disabled={selectedFilterType !== 'project'}>
										<View style={styles.projectFilterItem}>
											{filteredProjectId === project.id ? <RadioFilled size="24" color={theme.colors.primary} /> : <Radio size="24" color={theme.colors.muted} />}
											<View style={styles.title}>
												<Text size="secondary" color="regular">
													{project.name}
												</Text>
												<Text size="bodyMid" color="regular">
													({project.film_type})
												</Text>
											</View>
										</View>
									</Pressable>
								))
							)}
						</View>
					</View>
					{form.formState.errors.root && (
						<Text size="bodyMid" color="error">
							{form.formState.errors.root.message}
						</Text>
					)}
				</View>
			</Form>

			<View style={styles.footer}>
				<Button onPress={handleReset} type="secondary" textColor="regular" style={styles.widthHalf}>
					Reset
				</Button>
				<Button onPress={form.handleSubmit(onSubmit)} type="primary" textColor="black" style={styles.widthHalf}>
					Apply
				</Button>
			</View>
		</ScrollView>
	);
});

const stylesheet = createStyleSheet(theme => ({
	container: {
		paddingBottom: theme.padding.base,
	},
	emptyContainer: {
		paddingHorizontal: theme.padding.base,
		paddingBottom: theme.padding.base,
	},
	header: {
		gap: theme.gap.xxs,
		paddingHorizontal: theme.padding.base,
		paddingTop: theme.padding.base,
	},
	body: {
		gap: 40,
		marginVertical: theme.margins.xxl,
	},
	widthHalf: {
		width: '50%',
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	footer: {
		display: 'flex',
		width: '100%',
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		paddingHorizontal: theme.padding.base,
		paddingTop: theme.padding.base,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	filterItem: {
		paddingHorizontal: theme.padding.base,
		flexDirection: 'row',
		alignItems: 'center',
		gap: theme.gap.xxs,
	},
	filterContainer: (isSelected: boolean) => ({
		gap: theme.gap.xxl,
		opacity: isSelected ? 1 : 0.4,
	}),
	projectFilterContainer: {
		gap: theme.gap.xxs,
	},
	monthFilter: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderBottomWidth: theme.borderWidth.bold,
		borderColor: theme.colors.borderGray,
		paddingHorizontal: theme.padding.base,
		gap: theme.gap.base,
	},
	monthFilterItem: {
		flex: 1,
	},
	projectFilter: {
		alignItems: 'flex-start',
		borderBottomWidth: theme.borderWidth.bold,
		borderColor: theme.colors.borderGray,
	},
	projectFilterItemMarginContainer: {
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		flexDirection: 'row',
	},
	projectFilterItem: {
		marginHorizontal: theme.padding.base,
		padding: theme.padding.base,
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		flex: 1,
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		gap: theme.gap.xxs,
	},
	title: {
		flexDirection: 'row',
		gap: theme.gap.steps,
		alignItems: 'flex-end',
	},
	select: {
		backgroundColor: theme.colors.black,
		color: theme.colors.typography,
	},
}));

export default FilterInvoices;
