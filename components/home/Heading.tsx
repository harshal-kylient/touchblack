import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { View } from 'react-native';

import { Text } from '@touchblack/ui';
import HomeHeader from './HomeHeader';
import { useAuth } from '@presenters/auth/AuthContext';
import useGetTalentDetails from '@network/useGetTalentDetails';
import useGetProducerDetails from '@network/useGetProducerDetails';

function Heading({ isProducer }: any) {
	const { styles } = useStyles(stylesheet);
	const { loginType, userId, producerId } = useAuth();
	const { data: talentData } = useGetTalentDetails(userId!);
	const { data: producerData } = useGetProducerDetails(producerId!);

	const firstName = talentData?.data?.first_name;
	const producerName = producerData?.data?.name;

	return (
		<View style={styles.container}>
			<View style={styles.headerTitleContainer}>
				{loginType === 'producer' ? (
					<Text color="regular" style={{ minWidth: '70%', maxWidth: '70%' }} size="primaryMid" numberOfLines={1} weight="regular">
						{producerName}
					</Text>
				) : (
					<Text size="bodyBig" style={styles.textStyles}>
						Hey, {firstName}!
					</Text>
				)}

				<HomeHeader />
			</View>
		</View>
	);
}

export default Heading;

const stylesheet = createStyleSheet(theme => ({
	container: {
		flex: 1,
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		width: '100%',
	},
	mediumFont: {
		fontFamily: theme.fontFamily.cgExtraBold,
	},
	headerTitleContainer: {
		flexDirection: 'row',
		width: '100%',
		flex: 1,
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingLeft: 16,
	},
	titleContainer: {
		width: 'auto',
		paddingVertical: 8,
		paddingHorizontal: 16,
	},
	textStyles: {
		fontFamily: 'Cabinet Grotesk',
		fontSize: 22,
		fontWeight: '500',
		color: '#FFFFFF',
	},
}));
