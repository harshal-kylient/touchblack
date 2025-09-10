import { useState } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { useForm } from 'react-hook-form';
import { SheetManager } from 'react-native-actions-sheet';
import { pick, types } from '@react-native-documents/picker';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Text, TextInput } from '@touchblack/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import FormSchema from './schema';
import Asterisk from '@components/Asterisk';
import { SheetType } from 'sheets';
import server from '@utils/axios';
import jsonToFormdata from '@utils/jsonToFormData';
import CONSTANTS from '@constants/constants';
import { useAuth } from '@presenters/auth/AuthContext';

export type IProps = {
	onSuccess: Function;
};

export default function AddOtherFilm({ onSuccess }: IProps) {
	const { styles, theme } = useStyles(stylesheet);
	const [serverError, setServerError] = useState('');
	const { loginType, managerTalentId } = useAuth();
	const talentId = loginType === 'manager' ? managerTalentId : '';

	function handleInputChange(text: string, field: any) {
		setServerError('');
		field.onChange(text);
	}

	const form = useForm({
		resolver: zodResolver(FormSchema),
	});

	async function handleFileInput(onChange: (event: any) => void) {
		try {
			const file = await pick({
				presentationStyle: 'fullScreen',
				type: [types.csv, types.xls, types.xlsx, types.images, types.pdf],
			});
			onChange(file);
		} catch (err: unknown) {}
	}

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		const endpoint = CONSTANTS.endpoints.addShowreel(talentId);
		const formdata = jsonToFormdata(data);

		const response = await server.postForm(endpoint, formdata);
		if (response.data?.success) {
			SheetManager.show('Drawer', {
				payload: {
					sheet: SheetType.Success,
					data: { header: 'Success', text: response.data.message, onPress: onSuccess },
				},
			});
		} else {
			setServerError(response.data?.message || 'Something wrong happened, Please try later.');
		}
	}

	return (
		<View>
			<Text color="regular" size="primaryMid" style={[styles.baseMargin, { marginVertical: theme.margins.base }]}>
				Add New Film
			</Text>
			<View style={styles.xxlgap}>
				<Form {...form}>
					<FormField
						control={form.control}
						name="film_name"
						render={({ field }) => (
							<FormItem style={styles.baseMargin}>
								<FormLabel>
									Film Name <Asterisk />
								</FormLabel>
								<FormControl>
									<TextInput
										value={field.value}
										onChangeText={v => handleInputChange(v, field)}
										placeholder="Please enter the film name"
										placeholderTextColor={theme.colors.typographyLight}
										style={[
											styles.textinput,
											styles.inputPadding,
											{
												borderColor: serverError || form.formState.errors.user_identifier ? theme.colors.destructive : theme.colors.borderGray,
											},
										]}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="film_link"
						render={({ field }) => (
							<FormItem style={styles.baseMargin}>
								<FormLabel>
									Film URL (Youtube/Vimeo Link Only) <Asterisk />
								</FormLabel>
								<FormControl>
									<TextInput
										value={field.value}
										onChangeText={v => handleInputChange(v, field)}
										keyboardType="url"
										placeholder="https://"
										placeholderTextColor={theme.colors.typographyLight}
										style={[
											styles.textinput,
											styles.inputPadding,
											{
												borderColor: serverError || form.formState.errors.user_identifier ? theme.colors.destructive : theme.colors.borderGray,
											},
										]}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<View>
						{serverError ? (
							<View style={{ paddingVertical: theme.padding.xxs, borderTopWidth: theme.borderWidth.slim, borderColor: theme.colors.destructive }}>
								<Text size="bodyMid" textAlign="center" color="error">
									{serverError}
								</Text>
							</View>
						) : null}
						<View style={styles.footer}>
							<Button
								onPress={() =>
									SheetManager.hide('Drawer', {
										payload: { sheet: SheetType.AddFilm },
									})
								}
								type="secondary"
								textColor="regular"
								style={styles.widthHalf}>
								Cancel
							</Button>
							<Button onPress={form.handleSubmit(onSubmit)} type="primary" textColor="black" style={styles.widthHalf}>
								Add
							</Button>
						</View>
					</View>
				</Form>
			</View>
		</View>
	);
}

const stylesheet = createStyleSheet(theme => ({
	textinput: {
		borderWidth: theme.borderWidth.slim,
		color: theme.colors.typography,
		backgroundColor: theme.colors.black,
		fontFamily: 'CabinetGrotesk-Regular',
	},
	centered: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	inputPadding: {
		flexGrow: 1,
		paddingHorizontal: 10,
	},
	xxlgap: { gap: theme.gap.xxl },
	xxxlBottomMargin: { marginBottom: theme.margins.xxxl },
	baseMargin: { marginHorizontal: theme.margins.base },
	widthHalf: { width: '50%', borderWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray },
	footer: {
		display: 'flex',
		width: '100%',
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		padding: theme.padding.base,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	fileInputContainer: {
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		paddingHorizontal: theme.padding.xxxxl,
		paddingVertical: theme.padding.xxxxl,
		backgroundColor: theme.colors.black,
	},
	fileInputHeader: {
		fontFamily: 'CabinetGrotesk-Regular',
		textAlign: 'center',
		color: theme.colors.borderGray,
	},
	fileInputText: {
		fontFamily: 'CabinetGrotesk-Regular',
		color: theme.colors.borderGray,
	},
}));
