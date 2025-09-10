import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@touchblack/ui';
import ViewBox from '@components/ViewBox';
import { NoLikedFilmsSvg } from '@assets/svgs/errors';

interface IProps {
	title?: string;
	desc?: string;
	blackBackground?: boolean;
}

export default function NoLikedFilms({ title = 'No liked films !', desc, blackBackground = false }: IProps) {
	const { styles } = useStyles(stylesheet);
	return (
		<View style={styles.mainContainer}>
			<View style={styles.subContainer}>
				<View style={styles.container}>
					<NoLikedFilmsSvg />
					<View style={styles.textWrapper}>
						<Text size="primaryMid" color="regular" textAlign="center">
							{title}
						</Text>
						{desc ? (
							<Text size="bodyBig" color="muted" textAlign="center">
								{desc}
							</Text>
						) : null}
					</View>
				</View>
			</View>
		</View>
	);
}
const stylesheet = createStyleSheet(theme => ({
	container: {
		justifyContent: 'space-between',
		alignItems: 'center',
		gap: 64,
		paddingVertical: theme.padding.base*2,
	},
	textWrapper: {
		alignSelf: 'center',
		gap: theme.gap.xxs,
		paddingHorizontal: theme.padding.base,
	},
	mainContainer: {
		justifyContent: 'center',
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.muted,
		paddingHorizontal: 16,
	},
	subContainer: {
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.muted,
		alignItems: 'center',
	},
}));
