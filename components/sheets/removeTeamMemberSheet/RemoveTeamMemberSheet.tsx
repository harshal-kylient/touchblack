import { useEffect, useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { SheetManager } from 'react-native-actions-sheet';

import { Text, Button } from '@touchblack/ui';
import { darkTheme } from '@touchblack/ui/theme';
import CheckBox from '@react-native-community/checkbox';
import { Delete } from '@touchblack/icons';

import server from '@utils/axios';
import CONSTANTS from '@constants/constants';

export type RemoveTeamMemberSheetProps = {
	data?: any;
};

export default function RemoveTeamMemberSheet({ data }: RemoveTeamMemberSheetProps) {
	const { styles } = useStyles(stylesheet);
	const [isSaving] = useState<boolean>(false);
	const [checkboxState, setCheckboxState] = useState<{
		[key: string]: boolean;
	}>({});
	const [accessData, setAccessData] = useState<any[]>([]);
	const [idMap, setIdMap] = useState<{ [key: string]: string }>({});
	const [, setPermissionData] = useState<any[]>([]);
	const [permissionIds, setPermissionIds] = useState<any[]>([]);

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
	}, []);

	useEffect(() => {
		const fetchPermissionData = async () => {
			const response = await server.get(CONSTANTS.endpoints.producer_access_permission_list(data.teamData.id));
			setPermissionData(response.data.data);
			// Initialize checkbox state based on fetched permission data
			const initialCheckboxState = response.data.data.reduce((acc: { [key: string]: boolean }, item: any) => {
				acc[item.id] = true; // Assuming you want to check the checkbox if the permission exists
				return acc;
			}, {});
			setCheckboxState(initialCheckboxState);
		};

		fetchPermissionData();
	}, [data.teamData.id, setPermissionData]);

	const handleCheckboxPress = (id: string) => {
		setPermissionIds(prevIds => {
			if (prevIds.includes(id)) {
				return prevIds.filter(existingId => existingId !== id);
			} else {
				return [...prevIds, id];
			}
		});
		setCheckboxState(prevState => ({
			...prevState,
			[id]: !prevState[id],
		}));
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

	function handleCancelPress() {
		SheetManager.hide('Drawer');
	}

	const handleSave = async () => {
		// Split concatenated permission IDs and flatten the array
		const validPermissionIds = permissionIds.flatMap(id => id.split(',').map(str => str.trim())); // Split by comma and trim whitespace

		try {
			const response = await server.post(CONSTANTS.endpoints.producer_access_permission_update, {
				user_id: data.teamData.id,
				permission_ids: validPermissionIds,
			});
			if (response.data.success) {
				SheetManager.hide('Drawer');
			} else {
			}
		} catch (error) {}
	};

	const handleRemove = async (id: string) => {
		try {
			const response = await server.post(CONSTANTS.endpoints.remove_team_member(id));
			if (response.data.success) {
				SheetManager.hide('Drawer');
				data.mutateTeamMembers();
			}
		} catch (error) {}
	};

	return (
		<View style={styles.notificationContainer}>
			<View style={styles.bodyContainer}>
				<View style={{ gap: 24 }}>
					<View style={styles.listItemContainer}>
						<View style={styles.imageContainer}>
							<Image source={{ uri: data.teamData.profile_picture_url }} style={styles.listImage} />
						</View>
						<View style={styles.separatorView} />
						<View style={styles.rightContentContainer}>
							<Text color="regular" size="bodyBig">
								{data.teamData.first_name + ' ' + data.teamData.last_name}
							</Text>
							<Text color="regular" size="bodySm">
								{data.teamData.profession_type}
							</Text>
						</View>
					</View>
					<View style={styles.subListItemContainer}>
						<TouchableOpacity onPress={() => handleRemove(data.teamData.id)} style={styles.removeTeam}>
							<Text color="regular" size="bodyBig">
								Remove from team
							</Text>
							<Delete size="24" color={darkTheme.colors.typography} />
						</TouchableOpacity>
					</View>
				</View>
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
					{filteredAccessData.map((item, key) => (
						<View
							key={key}
							style={[
								styles.subContainer,
								{
									borderBottomWidth: key === accessData.length - 1 ? darkTheme.borderWidth.bold : darkTheme.borderWidth.none,
								},
							]}>
							<View style={styles.cardContainer}>
								<View style={styles.card}>
									<Text color="regular" weight="regular" size="primarySm">
										{item.label}
									</Text>
								</View>
								<View style={styles.checkboxContainer}>
									<CheckBox value={checkboxState[item.view]} onValueChange={() => handleCheckboxPress(item.view)} />
									<CheckBox value={checkboxState[item.edit]} onValueChange={() => handleCheckboxPress(item.edit)} />
								</View>
							</View>
						</View>
					))}
					<View style={styles.buttonFooter}>
						<Button onPress={handleCancelPress} type="secondary" textColor="regular" style={{ width: '50%' }}>
							Cancel
						</Button>
						<Button onPress={handleSave} type="primary" style={{ width: '50%' }}>
							{isSaving ? 'Saving...' : 'Save'}
						</Button>
					</View>
				</View>
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
		textAlign: 'center',
	},
	radioButtonContainer: {
		width: '100%',
	},
	footer: {
		display: 'flex',
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
	subListItemContainer: {
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		paddingHorizontal: theme.margins.lg,
	},
	separatorView: {
		width: 16,
	},
	rightContentContainer: {
		flexDirection: 'column',
		alignSelf: 'center',
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
	subContainer: {
		borderTopWidth: theme.borderWidth.bold,
		borderColor: theme.colors.borderGray,
	},
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
	removeTeam: {
		paddingVertical: theme.padding.lg,
		paddingHorizontal: theme.padding.base,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
}));
