import Header from '@components/Header';
import { Pressable, SafeAreaView, View, FlatList } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { EventsFilterStorage } from '@utils/storage';
import { useCallback, useState, useEffect } from 'react';
import { Button, Text as CustomText } from '@touchblack/ui';
import { Check } from '@touchblack/icons';
import CONSTANTS from '@constants/constants';
import useGetEventsCitiesList from '@network/useGetEventsCities';

export default function EventsFilter() {
	const { styles, theme } = useStyles(stylesheet);
	const navigation = useNavigation();
	const [message, setMessage] = useState('');
	const { data: response } = useGetEventsCitiesList();
	const cities = response?.data?.cities || [];
	const currentYear = new Date().getFullYear();
	const years = Array.from({ length: 5 }, (_, index) => currentYear - index);

	const [selectedYear, setSelectedYear] = useState<number | null>(null);
	const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
	const [selectedCity, setSelectedCity] = useState<string | null>(null);
	const [activeFilter, setActiveFilter] = useState<'year' | 'month' | 'city'>('year');
	const [isLoading, setIsLoading] = useState(true);

	const filterCategories = [
		{ key: 'year', title: 'Year', selectedValue: selectedYear, count: selectedYear ? 1 : 0 },
		{ key: 'month', title: 'Month', selectedValue: selectedMonth, count: selectedMonth ? 1 : 0 },
		{ key: 'city', title: 'City', selectedValue: selectedCity, count: selectedCity ? 1 : 0 },
	];

	const loadFilters = useCallback(async () => {
		try {
			setIsLoading(true);
			const savedFilters = await EventsFilterStorage.getString('eventFilters');
			if (savedFilters) {
				try {
					const parsed = JSON.parse(savedFilters);
					setSelectedYear(parsed.year ?? null);
					setSelectedMonth(parsed.month ?? null);
					setSelectedCity(parsed.city ?? null);
				} catch (e) {
					await EventsFilterStorage.delete('eventFilters');
				}
			}
		} catch (error) {
			console.error('Error loading filters:', error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		loadFilters();
	}, [loadFilters]);

	useFocusEffect(
		useCallback(() => {
			loadFilters();
		}, [loadFilters]),
	);

	const handleReset = useCallback(async () => {
		try {
			setSelectedYear(null);
			setSelectedMonth(null);
			setSelectedCity(null);

			await EventsFilterStorage.delete('eventFilters');
			setMessage('Filters have been reset');
			setTimeout(() => setMessage(''), 3000);
		} catch (error) {
			setMessage('Error resetting filters');
			setTimeout(() => setMessage(''), 3000);
		}
	}, []);

	const handleFilter = useCallback(async () => {
		try {
			const filters = {
				year: selectedYear,
				month: selectedMonth,
				city: selectedCity,
			};

			const filtersJson = JSON.stringify(filters);
			await EventsFilterStorage.set('eventFilters', filtersJson);
			setMessage('Filters applied successfully');
			setTimeout(() => {
				setMessage('');
			
			}, 1000);
				navigation.goBack();
		} catch (error) {
			setMessage('Error saving filters');
			setTimeout(() => setMessage(''), 3000);
		}
	}, [selectedYear, selectedMonth, selectedCity, navigation]);

	const handleYearSelect = useCallback((year: number) => {
		setSelectedYear(prev => (prev === year ? null : year)); 
	}, []);

	const handleMonthSelect = useCallback((month: string) => {
		setSelectedMonth(prev => (prev === month ? null : month)); 
	}, []);

	const handleCitySelect = useCallback((city: string) => {
		setSelectedCity(prev => (prev === city ? null : city)); 
	}, []);

	const renderFilterOptions = () => {
		if (isLoading) {
			return (
				<View style={styles.loadingContainer}>
					<CustomText size="bodyMid" color="regular">
						Loading...
					</CustomText>
				</View>
			);
		}

		switch (activeFilter) {
			case 'year':
				return (
					<FlatList
						data={years}
						keyExtractor={item => item.toString()}
						renderItem={({ item: year }) => (
							<Pressable style={styles.optionItem} onPress={() => handleYearSelect(year)}>
								<CustomText size="bodyMid" color="regular" style={[styles.optionText, selectedYear === year && styles.selectedOptionText]}>
									{year}
								</CustomText>
								{selectedYear === year && <Check size="17" color={theme.colors.primary} />}
							</Pressable>
						)}
					/>
				);
			case 'month':
				return (
					<FlatList
						data={CONSTANTS.MONTHS}
						keyExtractor={item => item.value}
						renderItem={({ item: month }) => (
							<Pressable style={styles.optionItem} onPress={() => handleMonthSelect(month.name)}>
								<CustomText size="bodyMid" color="regular" style={[styles.optionText, selectedMonth === month.name && styles.selectedOptionText]}>
									{month.name}
								</CustomText>
								{selectedMonth === month.name && <Check size="17" color={theme.colors.primary} />}
							</Pressable>
						)}
					/>
				);
			case 'city':
				return (
					<FlatList
						data={cities}
						keyExtractor={item => item}
						renderItem={({ item: city }) => (
							<Pressable style={styles.optionItem} onPress={() => handleCitySelect(city)}>
								<CustomText size="bodyMid" color="regular" style={[styles.optionText, selectedCity === city && styles.selectedOptionText]}>
									{city}
								</CustomText>
								{selectedCity === city && <Check size="17" color={theme.colors.primary} />}
							</Pressable>
						)}
					/>
				);
			default:
				return null;
		}
	};

	const hasActiveFilters = selectedYear || selectedMonth || selectedCity;

	return (
		<SafeAreaView style={styles.container}>
			<Header name="Filters" />
			<View style={styles.contentContainer}>
				<View style={styles.categoriesContainer}>
					<FlatList
						data={filterCategories}
						keyExtractor={item => item.key}
						renderItem={({ item }) => (
							<Pressable style={[styles.categoryItem, activeFilter === item.key && styles.activeCategoryItem]} onPress={() => setActiveFilter(item.key as 'year' | 'month' | 'city')}>
								<View style={styles.categoryContent}>
									<CustomText size="cardSubHeading" color="regular" style={[styles.categoryText, activeFilter === item.key && styles.activeCategoryText]}>
										{item.title}
									</CustomText>
									{item.selectedValue && <Check size="17" color={theme.colors.primary} />}
								</View>
							</Pressable>
						)}
					/>
				</View>

				<View style={styles.optionsContainer}>{renderFilterOptions()}</View>
			</View>

			{message ? (
				<Pressable onPress={() => setMessage('')} style={styles.messageContainer}>
					<CustomText size="bodyBig" style={styles.messageText}>
						{message}
					</CustomText>
				</Pressable>
			) : null}

			<View style={styles.buttonContainer}>
				<Button onPress={handleReset} type="secondary" textColor="regular" style={[styles.resetButton, !hasActiveFilters && styles.disabledButton]} disabled={!hasActiveFilters}>
					Reset
				</Button>
				<Button onPress={handleFilter} type="primary" style={styles.applyButton}>
					Apply
				</Button>
			</View>
		</SafeAreaView>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.black,
	},
	contentContainer: {
		flex: 1,
		flexDirection: 'row',
	},
	categoriesContainer: {
		width: '40%',
		backgroundColor: theme.colors.black,
	},
	categoryItem: {
		paddingVertical: theme.padding.xs * 1.5,
		paddingHorizontal: theme.padding.base,
		borderBottomWidth: 1,
		borderBottomColor: theme.colors.borderGray,
	},
	activeCategoryItem: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		borderRightWidth: 3,
		borderRightColor: theme.colors.primary,
	},
	categoryContent: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	categoryText: {
		fontSize: 15,
		fontWeight: '400',
	},
	activeCategoryText: {
		color: theme.colors.primary,
		fontWeight: '500',
	},
	indicatorText: {
		color: theme.colors.typography,
		fontSize: 12,
		fontWeight: '500',
	},
	optionsContainer: {
		flex: 1,
		backgroundColor: theme.colors.backgroundLightBlack,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	optionItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: theme.padding.xs * 1.5,
		paddingHorizontal: theme.padding.base * 2,
		marginHorizontal: theme.margins.base,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	optionText: {
		fontSize: 15,
		fontWeight: '400',
		flex: 1,
	},
	selectedOptionText: {
		color: theme.colors.primary,
		fontWeight: '500',
	},
	messageContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: theme.padding.xs,
	},
	messageText: {
		color: theme.colors.success,
	},
	buttonContainer: {
		paddingHorizontal: theme.padding.base,
		paddingVertical: theme.padding.sm,
		flexDirection: 'row',
		gap: theme.gap.sm,
	},
	resetButton: {
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		flex: 1,
	},
	disabledButton: {
		opacity: 0.5,
	},
	applyButton: {
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		flex: 1,
	},
}));
