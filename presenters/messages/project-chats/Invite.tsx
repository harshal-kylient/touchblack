import { Pressable, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { SheetManager } from 'react-native-actions-sheet';

import { Button, Text } from '@touchblack/ui';
import { FileUpload } from '@touchblack/icons';

import { FieldItem } from './FieldItem';
import Wrapper from './Wrapper';
import { SheetType } from 'sheets';
import { formatTimeFromTimestamp } from '@utils/formatDate';
import { IConversation, IProducerTalentTemplate } from '@models/entities/IMessages';
import capitalized from '@utils/capitalized';
import { useAuth } from '@presenters/auth/AuthContext';

type InviteProps = {
	conversation: IConversation;
	template: IProducerTalentTemplate;
	onFileDownload?: () => void;
	onOptOut?: () => void;
	onInterested?: () => void;
};

export default function Invite({ conversation, template, onFileDownload, onOptOut, onInterested }: InviteProps) {
	const { styles, theme } = useStyles(stylesheet);
	const { loginType } = useAuth();
	const userType = capitalized(loginType! === 'talent' ? 'User' : loginType!);
	const isProducer = userType === 'Producer';

	// const recipient = conversation.reciever_name;
	const borderColor = isProducer ? theme.colors.typography : theme.colors.typographyLight;
	const showActionButtons = !isProducer; // Only show action buttons for talent
	// message: "Hello Abhishek, Huge fans of your work! We think you'd be perfect for '7up - music video' in our next film. Attached is a synopsis and more details. If you are interested, then let's chat!",
	// brand_name: "7up",
	const heading = template.message.split(' ').slice(0, 2).join(' ');
	const message = template.message.split(' ').slice(2).join(' ');

	const formattedTime = formatTimeFromTimestamp(conversation.updated_at);

	const handleInterested = () => {
		if (onInterested) {
			onInterested();
		} else {
			SheetManager.show('Drawer', {
				payload: {
					sheet: SheetType.Negotiation,
					data: {
						// projectDetails: template, // DOUBT: can negotiation include project name, it would make it easier
					},
				},
			});
		}
	};

	const handleOptOut = () => {
		if (onOptOut) {
			onOptOut();
		} else {
			SheetManager.show('Drawer', {
				payload: {
					sheet: SheetType.OptOut,
					data: {
						projectDetails: template, // DOUBT: can negotiation include project name, it would make it easier
					},
				},
			});
		}
	};

	const fields = [
		{ label: 'Brand Name', value: template.brand_name },
		{ label: 'Project Name', value: template.project_name },
		{ label: 'Film Type', value: template.film_type },
		{ label: 'Film Brief', value: template.film_brief },
		{ label: 'Location', value: template.location.join(', ') },
		{ label: 'Date', value: template.dates.join(', ') },
	];

	return (
		<Wrapper sender={userType} readReceipt={formattedTime}>
			<View style={[styles.header, { borderColor }]}>
				<Text size="bodySm" color="regular">
					{heading}
				</Text>
				<Text size="bodySm" color="muted">
					{message}
				</Text>
			</View>
			<View style={styles.body}>
				<View style={styles.fields}>
					{fields.map((field, index) => (
						<FieldItem key={index} label={field.label} value={field.value} />
					))}
				</View>
				<Pressable onPress={onFileDownload}>
					<FileUpload size={'24'} color={theme.colors.typography} />
				</Pressable>
			</View>
			<View style={styles.footer}>
				{showActionButtons && (
					<View style={styles.buttonContainer}>
						<Button onPress={handleOptOut} style={styles.secondaryButton} type="secondary" textColor="regular">
							Opt Out
						</Button>
						<Button onPress={handleInterested} style={styles.button} type="primary">
							Interested
						</Button>
					</View>
				)}
			</View>
		</Wrapper>
	);
}
const stylesheet = createStyleSheet(theme => ({
	header: {
		paddingVertical: theme.padding.base,
		paddingHorizontal: theme.padding.xs,
		gap: theme.gap.steps,
		borderBottomWidth: theme.borderWidth.slim,
	},
	body: {
		paddingVertical: theme.padding.base,
		paddingHorizontal: theme.padding.xs,
		alignItems: 'center',
		flexDirection: 'row',
		maxWidth: '100%',
	},
	fields: {
		gap: theme.gap.base,
		flexShrink: 1,
	},
	footer: {},
	buttonContainer: {
		flexDirection: 'row',
		width: '100%',
		marginTop: theme.margins.base,
	},
	secondaryButton: {
		flex: 1,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	button: {
		flex: 1,
	},
}));
