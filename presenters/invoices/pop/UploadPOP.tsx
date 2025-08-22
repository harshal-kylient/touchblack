import React, { useCallback, useMemo } from 'react';
import { Image, SafeAreaView, ScrollView, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Controller, useForm } from 'react-hook-form';
import { pick, types } from '@react-native-documents/picker';
import { SheetManager } from 'react-native-actions-sheet';

import { Button, Form, Text } from '@touchblack/ui';
import { FocusPuller } from '@touchblack/icons';

import Header from '@components/Header';
import FormFieldWrapper from '@components/FormFieldWrapper';
import { formatAmount } from '@utils/formatCurrency';
import { zodResolver } from '@hookform/resolvers/zod';
import FormSchema, { UploadPopFormValues } from './schema';
import { SheetType } from 'sheets';

interface InvoiceItem {
	id: string;
	amount: string;
}

const invoiceData: InvoiceItem[] = [
	{ id: 'CRN0234354143', amount: '11020' },
	{ id: 'CRN01233254143', amount: '712020' },
	{ id: 'CRN0234354143', amount: '22126' },
];

const projectName = 'Project Name';
const headerName = `Upload POP (${projectName})`;

const FilePreview = React.memo(({ file }: { file: { uri: string; name: string } | null }) => {
	const { styles } = useStyles(stylesheet);
	if (!file) {
		return null;
	}
	return file.uri.endsWith('.pdf') ? (
		<Text size="bodyMid" color="regular">
			PDF: {file.name}
		</Text>
	) : (
		<Image source={{ uri: file.uri }} style={styles.previewImage} />
	);
});

const InvoiceRow = React.memo(({ item, index, isLast }: { item: InvoiceItem; index: number; isLast: boolean }) => {
	const { styles } = useStyles(stylesheet);
	return (
		<View style={styles.row(index, isLast)}>
			<Text size="bodySm" color="muted">
				{item.id}
			</Text>
			<Text size="bodyBig" color="regular" weight="bold">
				{formatAmount(item.amount)}
			</Text>
		</View>
	);
});

function UploadPOP() {
	const { styles } = useStyles(stylesheet);
	const form = useForm<UploadPopFormValues>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			pop: {
				media: '',
				id: '',
				date: '',
				note: '',
			},
		},
	});

	const amount = useMemo(() => invoiceData.reduce((acc, item) => acc + parseInt(item.amount), 0), []);

	const handleFileInput = useCallback(async () => {
		try {
			const file = await pick({
				presentationStyle: 'fullScreen',
				type: [types.csv, types.xls, types.xlsx, types.images, types.pdf],
			});
			form.setValue('pop.media', file);
		} catch (err: unknown) {}
	}, [form]);

	const handleSubmit = useCallback(() => {
		SheetManager.show('Drawer', {
			payload: {
				sheet: SheetType.Success,
				data: {
					header: 'Good Job!',
					text: 'POP for all the invoices of project Cion 02 have been submitted successfully',
					onPress: () => {
						SheetManager.hide('Drawer');
					},
				},
			},
		});
	}, []);

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView>
				<Header name={headerName} />
				<View style={styles.disclaimerContainer}>
					<Text size="secondary" color="regular">
						Proof of Payment
					</Text>
					<Text size="bodyBig" color="muted">
						POP for offline transaction can be NEFT/RTGS Receipt and that for online payment will be screenshot of payment with clear visibility of transaction ID.
					</Text>
				</View>
				{invoiceData.map((item, index) => (
					<InvoiceRow key={item.id} item={item} index={index} isLast={index === invoiceData.length - 1} />
				))}
				<View style={styles.totalContainer}>
					<Text size="bodyBig" color="regular">
						Total
					</Text>
					<Text size="bodyBig" color="regular" weight="bold">
						{formatAmount(amount.toString())}
					</Text>
				</View>
				<Form {...form}>
					<View style={styles.form}>
						<Controller
							control={form.control}
							name="pop.media"
							render={({ field, fieldState: { error } }) => (
								<View style={styles.inputContainer}>
									<View style={styles.mediaContainer}>
										<FilePreview file={field.value} />
										{!field.value && (
											<>
												<FocusPuller size="24" />
												<Text size="bodyMid" color="muted">
													Upload JPEG, PNG, PDF etc.
												</Text>
											</>
										)}
									</View>
									<Button type="primary" onPress={handleFileInput}>
										Upload
									</Button>
									{error && (
										<Text size="bodyMid" color="error">
											{error.message}
										</Text>
									)}
								</View>
							)}
						/>
						<FormFieldWrapper name="pop.id" label="Transaction ID (if any)" control={form.control} placeholder="Enter Transaction ID" errors={form.formState.errors} />
						<FormFieldWrapper name="pop.date" label="Transaction date" control={form.control} placeholder="Enter Date" errors={form.formState.errors} />
						<FormFieldWrapper name="pop.note" label="Note" control={form.control} placeholder="Enter Note" errors={form.formState.errors} />
					</View>
				</Form>
				<View style={styles.footer}>
					<Button type="primary" style={styles.button} onPress={form.handleSubmit(handleSubmit)}>
						Submit
					</Button>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

export default React.memo(UploadPOP);

const stylesheet = createStyleSheet(theme => ({
	container: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		flex: 1,
	},
	disclaimerContainer: {
		gap: theme.gap.base,
		paddingHorizontal: theme.padding.base,
		paddingVertical: theme.padding.xxl,
	},
	row: (index: number, length: number) => ({
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: theme.padding.base,
		paddingVertical: theme.padding.base,
		borderTopWidth: index === 0 ? theme.borderWidth.slim : 0,
		borderBottomWidth: index === length ? 0 : theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	}),
	totalContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: theme.padding.base,
		paddingVertical: theme.padding.base,
		backgroundColor: '#50483b',
	},
	form: {
		gap: theme.gap.xxl,
	},
	inputContainer: {
		margin: theme.margins.base,
		marginBottom: 0,
	},
	mediaContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		gap: theme.gap.base,
		minHeight: 250,
		backgroundColor: theme.colors.backgroundLightBlack,
	},
	footer: {
		flexDirection: 'row',
		padding: theme.padding.base,
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	button: {
		flex: 1,
	},
	previewImage: {
		width: '100%',
		height: 200,
		resizeMode: 'contain',
	},
}));
