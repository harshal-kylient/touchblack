import { View } from 'react-native';
import { useForm } from 'react-hook-form';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { SheetManager } from 'react-native-actions-sheet';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, FormControl, FormField, FormItem, FormMessage, Text, TextInput } from '@touchblack/ui';
import * as z from 'zod';

import server from '@utils/axios';
import CONSTANTS from '@constants/constants';
import { SheetType } from 'sheets';
import FormSchema, { ReportedType, ReporterType } from './schema';
import { useState } from 'react';

type UniqueId = string;
interface IProps {
	reportedType: ReportedType;
	reportedId: UniqueId;
	reporterId: UniqueId;
	reporterType: ReporterType;
}

const detailsHashmap = {
	User: 'Report inaccurate, inappropriate or missing details for this user to help us improve the platform.',
	Film: 'Report inaccurate, inappropriate or missing details for this film to help us improve the platform.',
};

export default function Report({ reporterId, reporterType, reportedType, reportedId }: IProps) {
	const { styles, theme } = useStyles(stylesheet);
	const [serverError, setServerError] = useState('');

	const form = useForm({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			reported_entity_id: reportedId,
			reported_entity_type: reportedType,
			reporter_type: reporterType,
			reporter_id: reporterId,
			reason: '',
		},
	});

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		const response = await server.post(CONSTANTS.endpoints.report, data);
		if (response.data?.success) {
			SheetManager.show('Drawer', {
				payload: {
					sheet: SheetType.Success,
					data: {
						header: 'Reported',
						text: `${data.reported_entity_type} is successfully reported.`,
						onPress: () => SheetManager.hideAll(),
					},
				},
			});
		} else {
			setServerError(response.data?.message);
		}
	}

	return (
		<View>
			<View style={styles.contentContainer}>
				<Text size="primaryMid" color="error" style={styles.regularFontFamily}>
					Report a {reportedType?.toLowerCase()} issue
				</Text>
				<Text size="bodyBig" color="muted" style={styles.regularFontFamily}>
					{detailsHashmap[reportedType]}
				</Text>
				<Form {...form}>
					<FormField
						name="reason"
						control={form.control}
						render={({ field }) => (
							<FormItem style={styles.baseGap}>
								<FormControl>
									<TextInput multiline placeholder={`Why are you reporting this ${reportedType}?`} placeholderTextColor={theme.colors.muted} value={field.value} onChangeText={value => field.onChange(value)} style={[styles.textInput, styles.regularFontFamily]} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</Form>
			</View>
			<Text color="error" size="primaryMid" style={styles.errorText(serverError)}>
				{serverError}
			</Text>
			<View style={styles.buttonContainer}>
				<Button
					textColor="regular"
					type="secondary"
					style={styles.buttonCancel}
					onPress={() =>
						SheetManager.hide('Drawer', {
							payload: { sheet: SheetType.Report },
						})
					}>
					Cancel
				</Button>
				<Button style={styles.buttonSubmit} onPress={form.handleSubmit(onSubmit)}>
					Report
				</Button>
			</View>
		</View>
	);
}

const stylesheet = createStyleSheet(theme => ({
	baseGap: {
		gap: theme.gap.xxs,
	},
	contentContainer: {
		margin: theme.margins.lg,
		gap: theme.gap.base,
	},
	formLabel: {
		fontSize: theme.fontSize.typographyMd,
	},
	textInput: {
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		color: theme.colors.typography,
		padding: 2,
		backgroundColor: theme.colors.backgroundDarkBlack,
		textAlignVertical: 'top',
		height: 80,
	},
	errorText: (serverError: any) => ({
		width: '100%',
		color: theme.colors.destructive,
		padding: 10,
		textAlign: 'center',
		fontSize: theme.fontSize.typographyMd,
		fontFamily: 'CabinetGrotesk-Regular',
		display: serverError ? 'flex' : 'none',
		borderTopWidth: theme.borderWidth.slim,
		borderTopColor: theme.colors.destructive,
	}),
	regularFontFamily: {
		fontFamily: 'CabinetGrotesk-Regular',
	},
	mediumFontFamily: {
		fontFamily: theme.fontFamily.cgMedium,
	},
	buttonCancel: {
		flexGrow: 1,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	buttonSubmit: {
		flexGrow: 1,
	},
	buttonContainer: {
		flexDirection: 'row',
		borderTopWidth: theme.borderWidth.slim,
		borderTopColor: theme.colors.muted,
		padding: theme.padding.lg,
	},
}));
