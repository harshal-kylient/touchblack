import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import FormSchema from './schema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Text, TextInput } from '@touchblack/ui';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import Asterisk from '@components/Asterisk';
import Select from '@components/Select';
import useGetProfessions from '@network/useGetProfessions';
import Animated from 'react-native-reanimated';

const gender = [
	{
		id: 'Male',
		name: 'Male',
	},
	{
		id: 'Female',
		name: 'Female',
	},
	{
		id: 'Gender Neutral',
		name: 'Gender Neutral',
	},
];

export default function UpdateTalentProfile() {
	const { styles, theme } = useStyles(stylesheet);
	const { data: response } = useGetProfessions();
	const professions = response?.pages?.flatMap(page => page) || [];
	const form = useForm({
		resolver: zodResolver(FormSchema),
	});

	return (
		<Form {...form}>
			<Animated.ScrollView bounces={false} style={[{ padding: theme.padding.base }]} contentContainerStyle={{ gap: theme.gap.base }}>
				<FormField
					name="first_name"
					control={form.control}
					rules={{ required: true }}
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								First Name <Asterisk />
							</FormLabel>
							<FormControl>
								<TextInput style={styles.textinput} value={field.value} onChangeText={field.onChange} placeholder="Enter First Name" placeholderTextColor={theme.colors.typographyLight} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					name="last_name"
					control={form.control}
					rules={{ required: true }}
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Last Name <Asterisk />
							</FormLabel>
							<FormControl>
								<TextInput style={styles.textinput} value={field.value} onChangeText={field.onChange} placeholder="Enter Last Name" placeholderTextColor={theme.colors.typographyLight} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="talent_role"
					rules={{ required: true }}
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Profession Type <Asterisk />
							</FormLabel>
							<FormControl>
								<Select value={field.value} onChange={field.onChange} placeholder="Select Talent Role" itemsToShow={5} items={professions} style={{ backgroundColor: theme.colors.black }} selectStyle={{ backgroundColor: theme.colors.black }} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					name="bio"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Bio</FormLabel>
							<FormControl>
								<TextInput style={styles.textinput} value={field.value} onChangeText={field.onChange} placeholder="Enter Your Bio" placeholderTextColor={theme.colors.typographyLight} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="gender"
					rules={{ required: true }}
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Gender <Asterisk />
							</FormLabel>
							<FormControl>
								<Select value={field.value} onChange={field.onChange} placeholder="Select Gender" itemsToShow={3} items={gender} style={{ backgroundColor: theme.colors.black }} selectStyle={{ backgroundColor: theme.colors.black }} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					name="rate_per_shoot_day"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Rate per project</FormLabel>
							<FormControl>
								<TextInput style={[styles.textinput, { paddingLeft: 36 }]} keyboardType="numeric" value={field.value} onChangeText={field.onChange} placeholder="Enter Rate per project" placeholderTextColor={theme.colors.typographyLight} />
								<Text color="regular" size="button" style={{ position: 'absolute', top: 18, left: 18 }}>
									₹
								</Text>
								<Text color="muted" size="bodyMid" style={{ position: 'absolute', top: 20, right: 18 }}>
									onwards
								</Text>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="city"
					rules={{ required: true }}
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Home Location <Asterisk />
							</FormLabel>
							<FormControl>
								<Select value={field.value} onChange={field.onChange} placeholder="Select Talent Role" itemsToShow={5} items={professions} style={{ backgroundColor: theme.colors.black }} selectStyle={{ backgroundColor: theme.colors.black }} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="state"
					rules={{ required: true }}
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Select value={field.value} onChange={field.onChange} placeholder="Select Talent Role" itemsToShow={5} items={professions} style={{ backgroundColor: theme.colors.black }} selectStyle={{ backgroundColor: theme.colors.black }} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="state"
					rules={{ required: true }}
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Select value={field.value} onChange={field.onChange} placeholder="Select Talent Role" itemsToShow={5} items={professions} style={{ backgroundColor: theme.colors.black }} selectStyle={{ backgroundColor: theme.colors.black }} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</Animated.ScrollView>
		</Form>
	);
}

const stylesheet = createStyleSheet(theme => ({
	textinput: {
		minHeight: 56,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		backgroundColor: theme.colors.black,
		color: theme.colors.typography,
		fontSize: theme.fontSize.title,
		fontFamily: 'CabinetGrotesk-Regular',
	},
}));
