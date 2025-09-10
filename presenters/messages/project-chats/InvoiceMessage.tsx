import useGetProjectDetails from '@network/useGetProjectDetails';
import { useAuth } from '@presenters/auth/AuthContext';
import { Download } from '@touchblack/icons';
import { Text, Button } from '@touchblack/ui';
import React, { useEffect, useState } from 'react';
import { Linking, Pressable, View, Alert } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import useSentByMe from './useSentByMe';
import CONSTANTS from '@constants/constants';

export default function InvoiceMessage({ item, project_id, conversation_id }) {
	useEffect(() => {
		setProjectId(project_id);
	}, [project_id]);
	const [amount, setAmount] = useState(0);
	const [touchblackamount, setTouchblackAmount] = useState(0);
	const { authToken, loginType } = useAuth();
	const [touchblackInvoiceId, setTouchblackInvoiceId] = useState('');
	const [talentInvoiceId, setTalentInvoiceId] = useState('');
	const [projectId, setProjectId] = useState('');
	const finalAmount = parseFloat(amount) + parseFloat(touchblackamount);
	// const handlePaymentRedirect = async () => {
	// 	const url = `${CONSTANTS.WEB_URL}/payment?talent_invoice_id=${talentInvoiceId}&touchblack_invoice_id=${touchblackInvoiceId}&project_id=${projectId}&amount=${finalAmount}&token=${authToken}&conversation_id=${conversation_id}`;
	// 	try {
	// 		await Linking.openURL(url);
	// 	} catch (error) {
	// 		Alert.alert('Error', `Failed to open URL: ${error}`);
	// 	}
	// };
	return (
		<View style={{ gap: 1 }}>
			<InvoiceComponent project_id={project_id} onSetTalentInvoiceId={setTalentInvoiceId} onSetAmount1={setAmount} item={item} />
			<TouchblackInvoiceComponent item={item} onSetTouchblackInvoiceId={setTouchblackInvoiceId} onSetAmount2={setTouchblackAmount} />
			{/* {loginType === 'producer' && <PayNowComponent onPayNow={handlePaymentRedirect} />} */}
		</View>
	);
}
// function PayNowComponent({ onPayNow }) {
// 	const { styles, theme } = useStyles(stylesheet2);
// 	return (
// 		<View style={styles.container}>
// 			<Button textColor="black" type="primary" onPress={onPayNow} style={styles.resendButton}>
// 				Pay Now
// 			</Button>
// 		</View>
// 	);
// }
function TouchblackInvoiceComponent({ item, onSetTouchblackInvoiceId, onSetAmount2 }) {
	const { styles, theme } = useStyles(stylesheet2);
	const { authToken } = useAuth();
	const touchblackFee = typeof item?.content?.touch_black_convenience_fee === Number ? item?.content?.touch_black_convenience_fee : 500;
	const igst = typeof item?.content?.igst === Number ? item?.content?.igst : 90;
	const touchblackInvoiceNumber = item?.content?.tb_invoice_number;
	const touchblackInvoiceId = item?.content?.tb_invoice_id;
	useEffect(() => {
		if (touchblackInvoiceId) onSetTouchblackInvoiceId(touchblackInvoiceId);
		onSetAmount2(igst + touchblackFee);
	}, [item, onSetTouchblackInvoiceId, onSetAmount2]);

	const sentByMe = useSentByMe(item);

	return (
		<View style={styles.container}>
			<AmountDetail sentByMe={sentByMe} label="Talent Grid Convenience" value={`+ ${touchblackFee}`} valueStyle={{ color: theme.colors.success }} />
			<AmountDetail sentByMe={sentByMe} label={`IGST Applied`} value={`+ ${igst}`} valueStyle={{ color: theme.colors.success }} />

			<View style={styles.totalAmount}>
				<View style={styles.totalText}>
					<Text size="primarySm" color="regular">
						Talent Grid Convenience fee
					</Text>
					<Text size="primarySm" color="regular">
						{touchblackFee + igst}
					</Text>
				</View>
			</View>
			<View style={styles.invoiceDetail}>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<Text size="bodyMid" color="muted">
						Invoice Number:{' '}
					</Text>
					<Text size="bodyMid" color="muted">
						{touchblackInvoiceNumber}
					</Text>
				</View>
				<Pressable style={{ paddingLeft: theme.padding.base }} onPress={() => Linking.openURL(`https://locations.talentgridnow.com/touchblack-invoices/${touchblackInvoiceId}?token=${authToken}`)}>
					<Download size="24" />
				</Pressable>
			</View>
		</View>
	);
}

type InvoiceComponentProps = {
	item: any;
	project_id: UniqueId;
	onSetTalentInvoiceId: any;
	onSetAmount1: any;
};

const InvoiceComponent: React.FC<InvoiceComponentProps> = ({ item, project_id, onSetTalentInvoiceId, onSetAmount1 }) => {
	const { styles, theme } = useStyles(stylesheet2);
	const { authToken } = useAuth();
	const { data: projectDetails } = useGetProjectDetails(project_id);

	const invoiceNumber = item?.content?.talent_invoice_number;
	const projectName = projectDetails?.project_name;
	const adType = projectDetails?.video_type?.name;
	const baseAmount = item?.content?.finalized_amount;
	const gstAmount = item?.content?.gst_amount;
	const totalReceivable = item?.content?.total_payable_amount;
	const gstPercent = item?.content?.gst_percentage;
	const note = item?.content?.note || 'Note : Offline payment expected. Complete GSTR-1 filing to avoid delays.';
	const invoiceId = item?.content?.talent_invoice_id;

	useEffect(() => {
		if (invoiceId) onSetTalentInvoiceId(invoiceId);
		onSetAmount1(totalReceivable);
	}, [item, onSetTalentInvoiceId, onSetAmount1]);

	const sentByMe = useSentByMe(item);
	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<View style={styles.headerText}>
					<Text size="bodyBig" color="regular">
						{projectName}
					</Text>
					<Text size="bodySm" color="muted">
						({adType})
					</Text>
				</View>
			</View>

			<AmountDetail sentByMe={sentByMe} label="Base Amount" value={baseAmount} />
			<AmountDetail sentByMe={sentByMe} label={`GST Amount (${gstPercent})`} value={`+ ${gstAmount}`} valueStyle={{ color: theme.colors.success }} />

			<View style={styles.totalAmount}>
				<View style={styles.totalText}>
					<Text size="primarySm" color="regular">
						Total Receivable Amount
					</Text>
					<Text size="primarySm" color="regular">
						{totalReceivable}
					</Text>
				</View>
			</View>

			<View style={styles.noteContainer}>
				<Text size="bodyMid" color="muted">
					{note}
				</Text>
			</View>

			<View style={styles.invoiceDetail}>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<Text size="bodyMid" color="muted">
						Invoice Number:{' '}
					</Text>
					<Text size="bodyMid" color="muted">
						{invoiceNumber}
					</Text>
				</View>
				<Pressable style={{ paddingLeft: theme.padding.base }} onPress={() => Linking.openURL(`https://locations.talentgridnow.com/invoices/${invoiceId}?token=${authToken}`)}>
					<Download size="24" />
				</Pressable>
			</View>
		</View>
	);
};

const stylesheet2 = createStyleSheet(theme => ({
	container: (sentByMe: boolean) => ({
		backgroundColor: sentByMe ? '#50483b' : theme.colors.backgroundLightBlack,
	}),
	header: {
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.muted,
		width: '100%',
		justifyContent: 'flex-start',
		padding: 12,
		marginBottom: 12,
	},
	resendButton: {
		backgroundColor: theme.colors.primary,
		paddingVertical: 14,
		borderColor: theme.colors.borderGray,
		borderWidth: 1,
	},
	headerText: {
		display: 'flex',
		flexDirection: 'column',
	},
	clientName: {
		color: '#FFF',
		fontSize: 16,
	},
	adType: {
		color: theme.colors.muted,
		fontSize: 12,
	},
	amountDetail: {
		padding: 12,
		marginBottom: 12,
	},
	totalAmount: {
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.muted,
		padding: theme.padding.sm,
	},
	totalText: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		width: '100%',
	},
	noteContainer: {
		padding: theme.padding.sm,
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.muted,
		backgroundColor: theme.colors.black,
	},
	invoiceDetail: {
		padding: 12,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	invoiceImage: {
		width: 24,
		height: 24,
	},
}));

/* AmountDetail */
type AmountDetailProps = {
	label: string;
	value: string | number;
	containerStyle?: object;
	valueStyle?: object;
	sentByMe: boolean;
};

export const AmountDetail: React.FC<AmountDetailProps> = ({ label, value, sentByMe, containerStyle, valueStyle }) => {
	const { styles } = useStyles(stylesheet);

	return (
		<View style={[styles.amountDetail, containerStyle]}>
			<Text size="bodyMid" color="muted">
				{label}
			</Text>
			<Text size="bodyMid" color="muted" style={valueStyle}>
				{value}
			</Text>
		</View>
	);
};

const stylesheet = createStyleSheet(theme => ({
	amountDetail: {
		padding: 12,
		color: theme.colors.typography,
		marginBottom: 12,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	labelContainer: {
		display: 'flex',
		flexDirection: 'column',
	},
	label: {
		color: theme.colors.typography,
		fontSize: 12,
	},
	value: {
		fontSize: 14,
	},
}));
