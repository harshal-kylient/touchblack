import { useState } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { useForm } from 'react-hook-form';
import { SheetManager } from 'react-native-actions-sheet';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Text, TextInput } from '@touchblack/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import FormSchema from './schema';
import { SheetType } from 'sheets';
import server from '@utils/axios';
import CONSTANTS from '@constants/constants';
import FilmOptionsEnum from '@models/enums/FilmOptionsEnum';
import IFilm from '@models/entities/IFilm';

interface IProps {
	type: FilmOptionsEnum;
	film: IFilm;
	onSuccess?: () => void;
}

export default function EditFilm({ type, film, onSuccess }: IProps) {
	const { styles, theme } = useStyles(stylesheet);
	const [serverError, setServerError] = useState('');

	function handleInputChange(text: string, field: any) {
		setServerError('');
		field.onChange(text);
	}

	const form = useForm({
		resolver: zodResolver(FormSchema(type)),
		defaultValues: {
			film_id: film?.film_id,
			film_name: film?.film_name || '',
			notes: '',
		},
	});

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		const endpoint = type === FilmOptionsEnum.ProducerFilms ? CONSTANTS.endpoints.edit_producer_film : CONSTANTS.endpoints.edit_talent_otherwork;

		const response = await server.postForm(endpoint, data);
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
			<Text color="regular" size="primaryMid" style={[styles.xxxlBottomMargin, styles.baseMargin]}>
				Edit Film
			</Text>
			<View style={styles.xxlgap}>
				<Form {...form}>
					<FormField
						control={form.control}
						name="film_name"
						render={({ field }) => (
							<FormItem style={{ marginHorizontal: theme.margins.base }}>
								<FormLabel>Film Name</FormLabel>
								<FormControl>
									<TextInput
										editable={type !== FilmOptionsEnum.ProducerFilms}
										onChangeText={v => handleInputChange(v, field)}
										placeholder="Please enter the film name"
										value={field.value}
										placeholderTextColor={theme.colors.typographyLight}
										style={[
											styles.textinput,
											styles.disabledInput(type === FilmOptionsEnum.ProducerFilms),
											styles.inputPadding,
											{
												borderColor: serverError || form.formState.errors.film_name ? theme.colors.destructive : theme.colors.borderGray,
											},
										]}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{type === FilmOptionsEnum.ProducerFilms ? (
						<FormField
							control={form.control}
							name="notes"
							render={({ field }) => (
								<View style={{ position: 'relative', height: 80, paddingHorizontal: theme.padding.base, borderTopWidth: theme.borderWidth.slim, borderBottomWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
									<FormItem style={{ position: 'absolute', paddingHorizontal: theme.padding.base, top: 0, left: 0, right: 0 }}>
										<FormControl>
											<TextInput
												multiline
												value={field.value}
												onChangeText={v => handleInputChange(v, field)}
												placeholder="Write a note for edits you want us to consider"
												placeholderTextColor={theme.colors.typographyLight}
												style={[
													styles.textinput,
													styles.textArea,
													styles.inputPadding,
													{
														borderColor: theme.colors.borderGray,
													},
												]}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								</View>
							)}
						/>
					) : null}
					{serverError ? (
						<Text size="bodyMid" color="error">
							{serverError}
						</Text>
					) : null}
					<View style={styles.footer}>
						<Button
							onPress={() =>
								SheetManager.hide('Drawer', {
									payload: { sheet: SheetType.EditFilm },
								})
							}
							type="secondary"
							textColor="regular"
							style={styles.widthHalf}>
							Cancel
						</Button>
						<Button onPress={form.handleSubmit(onSubmit)} type="primary" textColor="black" style={styles.widthHalf}>
							Submit
						</Button>
					</View>
				</Form>
			</View>
		</View>
	);
}

const stylesheet = createStyleSheet(theme => ({
	disabledInput: (disabled: boolean) => ({
		backgroundColor: disabled ? '#292929' : theme.colors.black,
	}),
	textinput: {
		borderWidth: theme.borderWidth.slim,
		color: theme.colors.typography,
		backgroundColor: theme.colors.black,
		fontFamily: 'CabinetGrotesk-Regular',
	},
	textArea: {
		height: 80,
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
	baseMargin: { margin: theme.margins.base },
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
