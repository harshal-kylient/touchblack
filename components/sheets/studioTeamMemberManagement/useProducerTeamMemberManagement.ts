import { useCallback, useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { SheetManager } from 'react-native-actions-sheet';
import { SheetType } from 'sheets';

import { useAuth } from '@presenters/auth/AuthContext';
import CONSTANTS from '@constants/constants';
import useProducerPermissionsList from '@network/useProducerPermissionsList';
import { useGetProducerPermissions } from '@network/useGetProducerPermissions';
import useManageProducerAccess from '@network/useManageProducerAccess';
import { useAddProducerTeamMember } from '@network/useAddProducerTeamMember';
import { useRemoveProducerTeamMember } from '@network/useRemoveProducerTeamMember';
import useGetProducerTeams from '@network/useGetProducerTeams';
import { useQueryClient } from '@tanstack/react-query';
import useGetUserDetailsById from '@network/useGetUserDetailsById';
import { useNavigation } from '@react-navigation/native';

export const useProducerTeamMemberManagement = (userId: string) => {
	const { producerId } = useAuth();
	const [error, setError] = useState<string | null>(null);
	const navigation = useNavigation();

	const { data: Permissions, isLoading: isLoadingStudioPermissions } = useGetProducerPermissions(userId);
	const { data: permissionsList, isLoading: isLoadingPermissionsList } = useProducerPermissionsList();
	const { data: talentData } = useGetUserDetailsById('User', userId);
	const manageAccessMutation = useManageProducerAccess();
	const addMemberMutation = useAddProducerTeamMember();
	const removeMemberMutation = useRemoveProducerTeamMember();
	const { data, refetch: refetchTeam } = useGetProducerTeams(producerId!);
	const teamMembers = data?.pages.flatMap(page => page.data) || [];
	const isNewMember = !teamMembers?.find(it => it?.id === userId);

	const queryClient = useQueryClient();
	const { control, handleSubmit, setValue, getValues } = useForm();

	Permissions?.forEach(it => {
		setValue(it?.name, true);
	});

	const mapPermissions = useMemo(() => {
		if (!Permissions) return {};
		return Permissions.reduce((acc, permission) => {
			acc[permission.name] = permission.status === 'Active';
			return acc;
		}, {} as Record<string, boolean>);
	}, [Permissions]);

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
				const isGranted = isNewMember ? defaultPermissions[permission] || false : mapPermissions[permission] || false;
				setValue(permission, isGranted);
			});
		}
	}, [isNewMember, mapPermissions, getDefaultPermissions, setValue, isLoadingStudioPermissions, isLoadingPermissionsList]);

	const isUserAlreadyInTeam = useCallback(() => {
		return teamMembers.some(member => member.id === userId);
	}, [teamMembers, userId]);

	const handleClose = useCallback(() => {
		queryClient.invalidateQueries('useGetTeamMembers');
		SheetManager.hide('Drawer');
	}, []);

	const onSubmit = useCallback(
		async data => {
			// const permissions = Permissions?.reduce((acc, it) => ({ ...acc, [it?.name]: true }), {});
			const formData = data;

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
					const res = await addMemberMutation.mutateAsync({ userId });
					if (!res.success) {
						setError(res.message);
						return;
					} else {
						SheetManager.show('Drawer', {
							payload: {
								sheet: SheetType.Success,
								data: {
									header: 'Success',
									text: 'Team member added successfully.',
									onPress: navigation.goBack(),
								},
							},
						});
						return;
					}
				}

				const res = await manageAccessMutation.mutateAsync({ userId, permissions: permissions || [] });
				if (!res.success) {
					setError(res.message);
					return;
				} else {
					SheetManager.show('Drawer', {
						payload: {
							sheet: SheetType.Success,
							data: {
								header: 'Success',
								text: 'Access permissions have been updated successfully.',
								onPress: handleClose,
							},
						},
					});
				}

				// handleClose();
			} catch (error) {
				setError(JSON.stringify(error) || 'An error occurred while managing the team member. Please try again.');
			}
		},
		[userId, isNewMember, permissionsList, addMemberMutation, manageAccessMutation, refetchTeam, isUserAlreadyInTeam, handleClose],
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
								await removeMemberMutation.mutateAsync({ userId });
								await refetchTeam();
								handleClose();
							},
						},
					},
				});
			}
		} catch (error) {
			setError('An error occurred while removing the team member. Please try again.');
		}
	}, [userId, handleClose, refetchTeam, removeMemberMutation, isNewMember]);

	return {
		getValues,
		setValue,
		control,
		error,
		handleClose,
		handleSubmit,
		handleRemoveMember,
		talentData,
		isNewMember,
		permissions: Permissions?.map(it => it?.name),
		isLoading: isLoadingStudioPermissions || isLoadingPermissionsList,
		onSubmit,
	};
};
