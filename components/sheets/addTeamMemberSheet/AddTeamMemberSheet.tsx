import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, TouchableOpacity, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { SheetManager } from 'react-native-actions-sheet';
import { FlatList } from 'react-native-gesture-handler';

import { Text, Button } from '@touchblack/ui';

import CheckBox from '@react-native-community/checkbox';
import server from '@utils/axios';
import CONSTANTS from '@constants/constants';
import LabelWithTouchableIcon from '@components/LabelWithTouchableIcon';
import SearchInput from '@components/SearchInput';

export type AddTeamMemberSheetProps = {
	data?: any;
};

export type TalentSearchType = {
	id: string;
	first_name: string;
	last_name: string;
	mobile_number: number;
	gender: string;
	films: string[];
	city: string;
	profession: string;
	profession_type: string;
	works_with: string[];
	user_producer_mappings: string[];
	profile_picture_url: URL;
};

export default function AddTeamMemberSheet({ data: teamMemberData }) {
	const [talentSearchResponse, setTalentSearchResponse] = useState<TalentSearchType[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [isSaving] = useState<boolean>(false);
	const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
	const [checkboxState, setCheckboxState] = useState<{ [key: string]: boolean }>({});
	const [idMap, setIdMap] = useState<{ [key: string]: string }>({});
	const [, setAccessData] = useState<any[]>([]);
	const [, setPermissionData] = useState<any[]>([]);
	const [permissionIds, setPermissionIds] = useState<any[]>([]);

	const toggleAccordion = (id: string) => {
		setExpandedItemId(prevId => (prevId === id ? null : id));
	};

	let filteredAccessData = [
		{
			id: 1,
			label: 'Full Access',
			edit: `${idMap['Blackbook::Edit']}, ${idMap['Messages::Edit']}`,
			view: `${idMap['Blackbook::View']}, ${idMap['Messages::View']}`,
		},
		{
			id: 2,
			label: 'Blackbook',
			edit: idMap['Blackbook::Edit'],
			view: idMap['Blackbook::View'],
		},
		{
			id: 3,
			label: 'Messages',
			edit: idMap['Messages::Edit'],
			view: idMap['Messages::View'],
		},
	];

	useEffect(() => {
		const fetchData = async () => {
			const response = await server.get(CONSTANTS.endpoints.access_permission_list);
			setAccessData(response.data.data);
			// Extracting IDs with names
			const idMap = response.data.data.reduce((acc: { [key: string]: string }, item: any) => {
				acc[item.name] = item.id;
				return acc;
			}, {});
			setIdMap(idMap);
		};

		fetchData();
	}, [setAccessData, setPermissionData]);

	useEffect(() => {
		const fetchTalentData = async () => {
			try {
				const response = await server.get(CONSTANTS.endpoints.search('user', searchQuery ? searchQuery : ''));
				if (response.status === 200) {
					setTalentSearchResponse(response.data);
					setLoading(false);
				}
			} catch (error) {
				// PENDING: Handle error (e.g., display error message)
				setLoading(false);
			}
		};
		fetchTalentData();
	}, [searchQuery]);

	useEffect(() => {
		const fetchPermissionData = async () => {
			const response = await server.get(CONSTANTS.endpoints.producer_access_permission_list(expandedItemId));
			setPermissionData(response.data.data);
			// Initialize checkbox state based on fetched permission data
			const initialCheckboxState = response.data.data.reduce((acc: { [key: string]: boolean }, item: any) => {
				acc[item.id] = true; // Assuming you want to check the checkbox if the permission exists
				return acc;
			}, {});
			setCheckboxState(initialCheckboxState);
		};
		fetchPermissionData();
	}, [expandedItemId, setPermissionData]);

	const { styles, theme } = useStyles(stylesheet);

	const handleCheckboxPress = (index: string) => {
		setPermissionIds(prevIds => {
			if (prevIds.includes(index)) {
				return prevIds.filter(existingId => existingId !== index);
			} else {
				return [...prevIds, index];
			}
		});
		setCheckboxState(prevState => ({
			...prevState,
			[index]: !prevState[index],
		}));
	};

	const renderItem = ({ item }: { item: TalentSearchType }) => (
		<TouchableOpacity onPress={() => toggleAccordion(item.id)}>
			<View style={styles.listItemContainer}>
				<View style={styles.imageContainer}>
					<Image source={{ uri: item.profile_picture_url }} style={styles.listImage} />
				</View>
				<View style={styles.separatorView} />
				<View style={styles.rightContentContainer}>
					<Text color="regular" size="bodyBig">
						{item.first_name + ' ' + item.last_name}
					</Text>
				</View>
			</View>
			{expandedItemId === item.id && (
				<View style={styles.accordionContent}>
					<View style={styles.talentCard}>
						<Text size="primaryMid" color="regular">
							Access
						</Text>
						<View style={{ flexDirection: 'row', gap: 16 }}>
							<Text size="primarySm" color="regular" style={{ paddingHorizontal: 16 }}>
								View
							</Text>
							<Text size="primarySm" color="regular" style={{ paddingHorizontal: 16 }}>
								Edit
							</Text>
						</View>
					</View>
					{filteredAccessData.map((index, key) => (
						<View key={key} style={[styles.subContainer(key, filteredAccessData)]}>
							<View style={styles.cardContainer}>
								<View style={styles.card}>
									<Text color="regular" weight="regular" size="primarySm">
										{index.label}
									</Text>
								</View>
								<View style={styles.checkboxContainer}>
									<CheckBox value={checkboxState[index.view]} onValueChange={() => handleCheckboxPress(index.view)} />
									<CheckBox value={checkboxState[index.edit]} onValueChange={() => handleCheckboxPress(index.edit)} />
								</View>
							</View>
						</View>
					))}
					<View style={styles.buttonFooter}>
						<Button onPress={handleCancelPress} type="secondary" textColor="regular" style={{ width: '50%' }}>
							Cancel
						</Button>
						<Button onPress={handleSave} type="primary" style={{ width: '50%' }}>
							{isSaving ? 'Adding...' : 'Add'}
						</Button>
					</View>
				</View>
			)}
		</TouchableOpacity>
	);

	if (loading) {
		return <ActivityIndicator style={{ paddingTop: 40 }} size="small" color={theme.colors.primary} />;
	}

	function handleCancelPress() {
		SheetManager.hide('Drawer');
	}

	const handleSave = async () => {
		try {
			const response = await server.post(CONSTANTS.endpoints.add_team_member(expandedItemId));
			if (response.data.success) {
				// Split concatenated permission IDs and flatten the array
				const validPermissionIds = permissionIds.flatMap(id => id.split(',').map(str => str.trim())); // Split by comma and trim whitespace

				try {
					const response = await server.post(CONSTANTS.endpoints.producer_access_permission_update, {
						user_id: expandedItemId,
						permission_ids: validPermissionIds,
					});
					if (response.data.success) {
						SheetManager.hide('Drawer');
						teamMemberData.mutateTeamMembers();
					}
				} catch (error) {}
				SheetManager.hide('Drawer');
			}
		} catch (error) {}
	};

	return (
		<View style={{ height: '100%' }}>
			<View
				style={{
					paddingVertical: theme.padding.base,
					gap: theme.padding.base,
					borderWidth: theme.borderWidth.slim,
					borderTopColor: theme.colors.borderGray,
				}}>
				<LabelWithTouchableIcon isHidden={true} onPress={() => {}} label="Add Team Member" />
				<SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
				<FlatList data={talentSearchResponse} renderItem={renderItem} keyExtractor={item => item.id.toString()} />
			</View>
		</View>
	);
}

const stylesheet = createStyleSheet(theme => ({
	notificationContainer: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
	header: {
		display: 'flex',
		alignSelf: 'flex-start',
		justifyContent: 'flex-start',
		padding: theme.padding.base,
	},
	bodyContainer: {
		display: 'flex',
		width: '100%',
		gap: theme.gap.xxs,
		padding: theme.padding.base,
		textAlign: 'center',
		alignItems: 'center',
	},
	radioButtonContainer: {
		width: '100%',
	},
	footer: {
		display: 'flex',
		flex: 1,
		width: '100%',
		padding: theme.padding.base,
		justifyContent: 'center',
		alignItems: 'center',
	},
	imageContainer: {
		width: 64,
		height: 64,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	listImage: {
		width: '100%',
		height: '100%',
	},
	listItemContainer: {
		flexDirection: 'row',
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		paddingHorizontal: theme.margins.lg,
	},
	separatorView: {
		width: 16,
	},
	rightContentContainer: {
		flexDirection: 'row',
		gap: theme.padding.base,
		alignItems: 'center',
	},
	buttonFooter: {
		display: 'flex',
		width: '100%',
		flexDirection: 'row',
		padding: theme.padding.base,
		justifyContent: 'center',
		alignItems: 'center',
	},
	accordionContent: {
		flexDirection: 'column',
		paddingTop: theme.padding.none,
	},
	talentCard: {
		flexDirection: 'row',
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		gap: theme.gap.base,
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: theme.padding.base,
	},
	container: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		flex: 1,
		paddingBottom: 10,
		justifyContent: 'space-between',
	},
	subContainer: (key: any, filteredAccessData) => ({
		borderTopWidth: theme.borderWidth.bold,
		borderColor: theme.colors.borderGray,
		borderBottomWidth: key === filteredAccessData.length - 1 ? theme.borderWidth.bold : theme.borderWidth.none,
	}),
	cardContainer: {
		marginLeft: theme.margins.base,
		marginRight: theme.margins.xl,
		borderLeftWidth: theme.borderWidth.bold,
		borderLeftColor: theme.colors.borderGray,
		borderRightWidth: theme.borderWidth.bold,
		borderRightColor: theme.colors.borderGray,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	card: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: theme.padding.base,
	},
	button: {
		flexGrow: 1,
		marginHorizontal: theme.margins.base,
		marginBottom: theme.margins.xxl,
		borderColor: theme.colors.primary,
		borderWidth: theme.borderWidth.slim,
		textDecorationLine: 'none',
	},
	checkboxContainer: {
		flexDirection: 'row',
		gap: 40,
		marginRight: theme.margins.sm,
	},
}));
