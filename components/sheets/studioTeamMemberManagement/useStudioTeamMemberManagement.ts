// useStudioTeamMemberManagement.ts
import { useCallback, useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { SheetManager } from 'react-native-actions-sheet';
import { useNavigation } from '@react-navigation/native';
import { SheetType } from 'sheets';

import { useAuth } from '@presenters/auth/AuthContext';
import { useStudioPermissionsList } from '@network/useStudioPermissionsList';
import { useStudioPermissions } from '@network/useStudioPermissions';
import { useAddStudioTeamMember } from '@network/useAddStudioTeamMember';
import { useManageStudioAccess } from '@network/useManageStudioAccess';
import useGetStudioTeam from '@network/useGetStudioTeam';
import { useRemoveStudioTeamMember } from '@network/useRemoveStudioTeamMember';
import CONSTANTS from '@constants/constants';

export const useStudioTeamMemberManagement = (userId: string, isNewMember: boolean) => {
	const { studioId } = useAuth();
	const navigation = useNavigation();
	const { control, handleSubmit, setValue } = useForm();
	const [error, setError] = useState<string | null>(null);

	const { data: studioPermissions, isLoading: isLoadingStudioPermissions } = useStudioPermissions(userId, studioId);
	const { data: permissionsList, isLoading: isLoadingPermissionsList } = useStudioPermissionsList(studioId);
	const manageAccessMutation = useManageStudioAccess();
	const addMemberMutation = useAddStudioTeamMember();
	const removeMemberMutation = useRemoveStudioTeamMember();
	const { data, refetch: refetchStudioTeam } = useGetStudioTeam(studioId);
	const teamMembers = data?.pages.flatMap(page => page.data) || [];

	const mapStudioPermissions = useMemo(() => {
		if (!studioPermissions) return {};
		return studioPermissions.reduce((acc, permission) => {
			acc[permission.name] = permission.status === 'Active';
			return acc;
		}, {} as Record<string, boolean>);
	}, [studioPermissions]);

	const getDefaultPermissions = useCallback(() => {
		if (!permissionsList) return {};
		return permissionsList.reduce((acc, permission) => {
			acc[permission.name] = permission.isGranted || false;
			return acc;
		}, {} as Record<string, boolean>);
	}, [permissionsList]);

	useEffect(() => {
		if (!isLoadingStudioPermissions && !isLoadingPermissionsList) {
			const defaultPermissions = getDefaultPermissions();
			Object.values(CONSTANTS.STUDIO_PERMISSIONS).forEach(permission => {
				const isGranted = isNewMember ? defaultPermissions[permission] || false : mapStudioPermissions[permission] || false;
				setValue(permission, isGranted);
			});
		}
	}, [isNewMember, mapStudioPermissions, getDefaultPermissions, setValue, isLoadingStudioPermissions, isLoadingPermissionsList]);

	const isUserAlreadyInTeam = useCallback(() => {
		return teamMembers.some(member => member.id === userId);
	}, [teamMembers, userId]);

	const handleClose = useCallback(() => {
		SheetManager.hide('Drawer');
		if (isNewMember) {
			navigation.navigate('StudioProfile', { activeTabFromParams: 'Team' });
		}
	}, [navigation, isNewMember]);

	const onSubmit = useCallback(
		async formData => {
			try {
				setError(null);

				if (isNewMember && isUserAlreadyInTeam()) {
					setError('User is already in the team');
					return;
				}

				const permissions = Object.entries(formData).reduce((acc, [key, value]) => {
					if (value && permissionsList) {
						const permissionObject = permissionsList.find(p => p.name === key);
						if (permissionObject) {
							acc.push(permissionObject.id);
						}
					}
					return acc;
				}, [] as string[]);

				if (isNewMember) {
					const res = await addMemberMutation.mutateAsync({ userId, studioId });
					if (!res?.success) {
						setError(res?.message);
						return;
					} else {
						SheetManager.show('Drawer', {
							payload: {
								sheet: SheetType.Success,
								data: {
									header: 'Success',
									text: 'Team member added successfully.',
									onDismiss: handleClose,
								},
							},
						});
					}
				}

				if (!isNewMember && !permissions.length) {
					const res = await manageAccessMutation.mutateAsync({ userId, studioId, permissions: [] });
					if (!res?.success) {
						setError(res?.message);
						return;
					} else {
						SheetManager.show('Drawer', {
							payload: {
								sheet: SheetType.Success,
								data: {
									header: 'Success',
									text: 'Access permissions have been updated successfully.',
									onDismiss: handleClose,
								},
							},
						});
					}
				}

				if (permissions.length > 0) {
					const res = await manageAccessMutation.mutateAsync({ userId, studioId, permissions });
					if (!res?.success) {
						setError(res?.message);
						return;
					} else {
						SheetManager.show('Drawer', {
							payload: {
								sheet: SheetType.Success,
								data: {
									header: 'Success',
									text: 'Access permissions have been updated successfully.',
									onDismiss: handleClose,
								},
							},
						});
					}
				}
				await refetchStudioTeam();
				// handleClose();
			} catch (error) {
				setError(JSON.stringify(error) || 'An error occurred while managing the team member. Please try again.');
			}
		},
		[userId, studioId, isNewMember, permissionsList, addMemberMutation, manageAccessMutation, refetchStudioTeam, isUserAlreadyInTeam, handleClose],
	);

	const handleRemoveMember = useCallback(async () => {
		try {
			if (isNewMember) {
				handleClose();
			} else {
				SheetManager.show('Drawer', {
					payload: {
						sheet: SheetType.Delete,
						data: {
							text: 'Are you sure you want to remove this team member?',
							header: 'Remove team member',
							onDismiss: handleClose,
							onDelete: async () => {
								await removeMemberMutation.mutateAsync({ userId, studioId });
								await refetchStudioTeam();
								handleClose();
							},
						},
					},
				});
			}
		} catch (error) {
			setError('An error occurred while removing the team member. Please try again.');
		}
	}, [userId, studioId, handleClose, refetchStudioTeam, removeMemberMutation, isNewMember]);

	return {
		control,
		error,
		handleClose,
		handleSubmit,
		handleRemoveMember,
		isLoading: isLoadingStudioPermissions || isLoadingPermissionsList,
		onSubmit,
	};
};
