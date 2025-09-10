import { TouchableOpacity, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { Archive } from '@touchblack/icons';
import { Text } from '@touchblack/ui';

interface IBlackBookFooterProps {
	archived_blackbooks_count: number;
}

function BlackBookFooter({ archived_blackbooks_count }: IBlackBookFooterProps) {
	const [archivedCount, setArchivedCount] = useState(archived_blackbooks_count);

	useEffect(() => {
		setArchivedCount(archived_blackbooks_count);
	}, [archived_blackbooks_count]);

	const { styles } = useStyles(stylesheet);
	const navigation = useNavigation<any>();

	return (
		<TouchableOpacity onPress={() => navigation.navigate('ArchivedBlackBook')} activeOpacity={0.5} style={styles.archivedInlineButtonContainer}>
			<View style={styles.archivedInlineButtonIconContainer}>
				<Archive size="24" />
			</View>
			<Text style={styles.archivedInlineButtonText} size="cardSubHeading" color="regular">
				Show all archived ({archivedCount})
			</Text>
		</TouchableOpacity>
	);
}

export default BlackBookFooter;

const stylesheet = createStyleSheet(theme => ({
	footerContainer: {
		position: 'absolute',
		bottom: 0,
		width: '100%',
	},
	archivedInlineButtonContainer: {
		// width: '100%',
		width: '100%',
		paddingVertical: theme.padding.xxs,
		justifyContent: 'center',
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: theme.colors.backgroundLightBlack,
		borderTopWidth: theme.borderWidth.slim,
		borderTopColor: theme.colors.borderGray,
	},
	archivedInlineButtonIconContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: theme.margins.xxs,
	},
	archivedInlineButtonText: {
		opacity: 0.8,
	},
}));
