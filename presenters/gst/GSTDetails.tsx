import { useCallback, memo, useEffect, useMemo, useState } from 'react';
import { Keyboard, SafeAreaView, ScrollView, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { SheetManager } from 'react-native-actions-sheet';

import { Form, Text, Button, FormItem, FormLabel, FormControl, FormMessage, FormField } from '@touchblack/ui';
import { zodResolver } from '@hookform/resolvers/zod';

import FormSchema, { GSTFormValues } from './schema';
import Header from '@components/Header';
import { SheetType } from 'sheets';
import Asterisk from '@components/Asterisk';
import FormFieldWrapper from '@components/FormFieldWrapper';
import { useAuth } from '@presenters/auth/AuthContext';
import useGetStates from '@network/useGetStates';
import useGetPincodes from '@network/useGetPincodes';
import useGetGSTDetails from '@network/useGetGSTDetails';
import { useGSTDetailsLogic } from './useGSTDetailsLogic';
import TextPlaceholder from '@components/loaders/TextPlaceholder';
import AutocompleteInput from '@components/AutocompleteInput';
import CONSTANTS from '@constants/constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const GSTDetails = memo(function GSTDetails({ route }) {
	const { id } = route.params || {};
	const { role } = route.params || {};
	const { styles, theme } = useStyles(stylesheet);
	const navigation = useNavigation();
	const { loginType, userId, businessOwnerId } = useAuth();
	const user_id = loginType === 'talent' || 'manager' ? userId : loginType === 'studio' ? userId : businessOwnerId;
	const isEditing = !!id;
	const [pincodeQuery, setPincodeQuery] = useState('');
	const [screenHeight, setScreenHeight] = useState(CONSTANTS.screenHeight);
	const [headerHeight, setHeaderHeight] = useState(0);
	const [bottomHeight, setBottomHeight] = useState(0);
	const insets = useSafeAreaInsets();

	const { data: states = [], isLoading: isStatesLoading } = useGetStates();
	const { data: response, isLoading: isPincodesLoading, fetchNextPage, hasNextPage } = useGetPincodes(pincodeQuery);
	const pincodes = useMemo(() => response?.pages?.flatMap(page => page?.results).map(it => ({ id: it?.id, name: it?.pincode })) || [], [response]);

	const { data: gstDetails, isLoading: isGSTDetailsLoading } = useGetGSTDetails(id, role);
	const gstSubmit = useGSTDetailsLogic(id, role);

	const formFields = [
		{ name: 'gstin', label: 'GSTIN', placeholder: 'Please enter your GST Number', type: 'text' as const },
		{ name: 'legal_name', label: 'Legal Name/ Trade Name', placeholder: 'Please enter your legal/trade name', type: 'text' as const },
		{ name: 'address', label: 'Address', placeholder: 'Please enter your address', multiline: true, numberOfLines: 4, type: 'text' as const },
		{ name: 'state_id', label: 'State', placeholder: 'Please select your state', type: 'select' as const, items: states },
	];

	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', event => {
			setScreenHeight(CONSTANTS.screenHeight - event.endCoordinates.height - headerHeight - bottomHeight - insets.top - insets.bottom);
		});

		const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
			setScreenHeight(CONSTANTS.screenHeight);
		});

		return () => {
			keyboardDidShowListener.remove();
			keyboardDidHideListener.remove();
		};
	}, []);

	const handleLayout = (event: any) => {
		const { height } = event.nativeEvent.layout;
		setHeaderHeight(height);
	};

	const handleLayout2 = (event: any) => {
		const { height } = event.nativeEvent.layout;
		setBottomHeight(height);
	};

	const form = useForm<GSTFormValues>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			gstin: '',
			legal_name: '',
			address: '',
			state_id: { id: '', name: '' },
			pincode_id: { id: '', name: '' },
			user_id: user_id ?? '',
		},
	});

	useEffect(() => {
		if (isEditing && gstDetails && states.length > 0) {
			const stateId = gstDetails.data?.state_id ?? '';
			const pincodeId = gstDetails.data?.pincode_id ?? '';
			form.reset({
				...gstDetails,
				user_id: user_id ?? '',
				gstin: gstDetails.data.gstin,
				legal_name: gstDetails.data.legal_name,
				address: gstDetails.data.address,
				state_id: {
					id: stateId,
					name: states.find(state => state.id === stateId)?.name || '',
				},
				pincode_id: {
					id: pincodeId,
					name: gstDetails.data.gst_pincode,
				},
			});
		}
	}, [isEditing, gstDetails, form, states, user_id]);

	const handlePincodeSearch = useCallback((query: string) => {
		setPincodeQuery(query);
	}, []);

	const loadMorePincodes = useCallback(() => {
		if (hasNextPage) {
			fetchNextPage();
		}
	}, [hasNextPage, fetchNextPage]);

	const onError = useCallback(
		(error: any) => {
			form.setError('root', { message: error.message });
		},
		[form],
	);

	const onSubmit = useCallback(
		async (data: GSTFormValues) => {
			try {
				data.gst_pincode = data.pincode_id.name;
				const response = await gstSubmit.mutateAsync(data);
				if (response.data?.success) {
					SheetManager.show('Drawer', {
						payload: {
							sheet: SheetType.Success,
							data: { header: 'Success', text: isEditing ? 'GSTIN updated successfully' : 'GSTIN added successfully', onPress: null },
						},
					});

					navigation.navigate('GSTList', { role });
				} else {
					throw new Error(response.data?.message || 'Something went wrong. Please try again later.');
				}
			} catch (error) {
				form.setError('root', { message: error.message });
			}
		},
		[navigation, form, gstSubmit, isEditing],
	);

	return (
		<SafeAreaView style={styles.container}>
			<Header onLayout={handleLayout} name="GSTIN Details" />
			<View style={{ flex: 1, justifyContent: 'space-between', maxHeight: screenHeight }}>
				<ScrollView>
					{isStatesLoading || isGSTDetailsLoading ? (
						<>
							<TextPlaceholder customWidth={'100%'} />
							<TextPlaceholder customWidth={'100%'} />
							<TextPlaceholder customWidth={'100%'} />
						</>
					) : (
						<Form {...form}>
							<View style={styles.body}>
								{formFields.map(field => (
									<FormFieldWrapper
										key={field.name}
										control={form.control}
										errors={form.formState.errors}
										value={form.watch(field.name)}
										{...field}
										label={
											<>
												{field.label}
												<Asterisk />
											</>
										}
									/>
								))}
								<FormField
									control={form.control}
									name="pincode_id"
									render={({ field }) => (
										<FormItem style={[styles.formItem]}>
											<FormLabel style={styles.formLabel}>
												Pincode
												<Asterisk />
											</FormLabel>
											<FormControl>
												<AutocompleteInput items={pincodes} onSearch={handlePincodeSearch} value={field.value} onChange={field.onChange} placeholder="Search for a pincode" itemsToShow={4} onLoadMore={loadMorePincodes} isLoading={isPincodesLoading} errors={form.formState.errors} name="pincode_id" />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								{form.formState.errors.root && (
									<Text size="bodyMid" style={styles.error} color="error">
										{form.formState.errors.root.message}
									</Text>
								)}
							</View>
						</Form>
					)}
				</ScrollView>
				<View style={styles.footer}>
					<Button onPress={form.handleSubmit(onSubmit, onError)}>{isEditing ? 'Update' : 'Submit'}</Button>
				</View>
			</View>
		</SafeAreaView>
	);
});

export default GSTDetails;

const stylesheet = createStyleSheet(theme => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
	body: {
		gap: theme.gap.xxl,
		marginVertical: theme.margins.base,
		flex: 1,
	},
	error: {
		paddingHorizontal: theme.margins.base,
	},
	footer: {
		display: 'flex',
		borderTopWidth: theme.borderWidth.slim,
		backgroundColor: theme.colors.backgroundLightBlack,
		borderColor: theme.colors.borderGray,
		padding: theme.padding.base,
	},
	formItem: {
		marginHorizontal: theme.margins.base,
		gap: theme.gap.xxs,
	},
	formLabel: {
		opacity: 0.8,
	},
}));
