import { useState } from 'react';
import { View, Text as RNText, Pressable } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { SheetManager } from 'react-native-actions-sheet';

import { Text, Button, Form, Avatar, FormField, FormMessage, FormItem, FormControl } from '@touchblack/ui';
import server from '@utils/axios';
import CONSTANTS from '@constants/constants';
import { useAuth } from '@presenters/auth/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormSchema from './schema';
import * as z from 'zod';
import { launchImageLibrary } from 'react-native-image-picker';

export type EditProfilePictureSheetProps = {
	onSuccess: () => void;
};

export default function EditProfilePictureSheet({ onSuccess }: EditProfilePictureSheetProps) {
	const { styles, theme } = useStyles(stylesheet);
	const { loginType, userId, producerId } = useAuth();
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [message, setMessage] = useState('');
	const queryClient = useQueryClient();

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	});

	function handleCancelPress() {
		SheetManager.hide('Drawer');
	}

	async function handleFileInput(onChange: (event: any) => void) {
		try {
			const file = await launchImageLibrary({ presentationStyle: 'fullScreen', mediaType: 'photo', selectionLimit: 1 });
			const filename = file.assets?.[0]?.fileName;

			if (filename?.toLowerCase()?.endsWith('.heif') || filename?.toLowerCase()?.endsWith('.heic')) {
				setMessage('Only .png, .jpg, .jpeg file types are supported');
				return;
			}

			onChange(file.assets?.[0]);
		} catch (err: unknown) {}
	}

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		if (!data.profile_picture) {
			return;
		}

		try {
			setIsSaving(true);

			const formData = new FormData();
			formData.append('profile_picture', {
				uri: data.profile_picture.uri,
				name: data.profile_picture.fileName,
				type: data.profile_picture.type,
			});

			const endpoint = loginType === 'talent' || 'manager' ? CONSTANTS.endpoints.talent_profilepic : loginType === 'producer' ? CONSTANTS.endpoints.producer_profilepic : '';

			const response = await server.post(endpoint, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});

			if (response.data?.success) {
				if (loginType === 'talent') {
					try {
						queryClient.invalidateQueries(['useGetUserDetailsById', 'User', userId!]);
					} catch (error) {}
				} else if (loginType === 'producer') {
					try {
						queryClient.invalidateQueries(['useGetUserDetailsById', 'Producer', producerId!]);
					} catch (error) {}
				}
				onSuccess();
				SheetManager.hide('Drawer');
			} else {
			}
		} catch (error) {
		} finally {
			setIsSaving(false);
		}
	}

	return (
		<View style={styles.notificationContainer}>
			<View style={styles.header}>
				<Text size="primaryMid" color="regular">
					Edit picture
				</Text>
			</View>
			
			<View style={styles.header2}>
				<Text size="bodyMid" color="muted">
					Please upload a profile picture smaller than 5 MB.
				</Text>
			</View>
			<Form {...form}>
				<FormField
					control={form.control}
					name="profile_picture"
					render={({ field }) => (
						<FormItem style={{ minWidth: '100%' }}>
							<FormControl style={{ minWidth: '100%' }}>
								<Pressable onPress={() => handleFileInput(field.onChange)} style={styles.bodyContainer}>
									<View style={[styles.iconContainer]}>
										<Avatar source={field.value} />
									</View>
									<View style={styles.inlineButtonContainer}>
										<RNText style={{ pointerEvents: 'none', textAlign: 'center', fontFamily: theme.fontFamily.cgBold, color: theme.colors.primary, fontSize: theme.fontSize.button }}>Change</RNText>
									</View>
								</Pressable>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</Form>
			{message ? (
				<Text color="error" textAlign="center" size="bodyMid" style={{ paddingVertical: theme.padding.xxs, backgroundColor: theme.colors.black, minWidth: '100%' }}>
					{message}
				</Text>
			) : null}
			<View style={styles.footer}>
				<Button onPress={handleCancelPress} type="secondary" textColor="regular" style={{ width: '50%' }}>
					Cancel
				</Button>
				<Button onPress={form.handleSubmit(onSubmit)} type="primary" style={{ width: '50%' }}>
					{isSaving ? 'Saving...' : 'Save'}
				</Button>
			</View>
		</View>
	);
}

const stylesheet = createStyleSheet(theme => ({
	notificationContainer: {
		alignItems: 'center',
		justifyContent: 'flex-start',
		backgroundColor: theme.colors.backgroundLightBlack,
	},
	header: {
		paddingVertical: theme.padding.base,
	},
	header2:{
		paddingBottom: theme.padding.sm,
	},
	bodyContainer: {
		width: '100%',
		textAlign: 'center',
		alignItems: 'center',
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	iconContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: theme.colors.backgroundDarkBlack,
		padding: theme.padding.base,
		borderRightWidth: theme.borderWidth.slim,
		borderLeftWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	inlineButtonContainer: {
		justifyContent: 'center',
		alignContent: 'center',
		width: '100%',
		padding: theme.padding.base,
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	footer: {
		width: '100%',
		flexDirection: 'row',
		padding: theme.padding.base,
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		justifyContent: 'center',
		alignItems: 'center',
	},
}));
