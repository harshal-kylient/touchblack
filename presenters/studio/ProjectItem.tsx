import { Pressable, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@touchblack/ui';
import { IProject } from '@models/entities/IProject';
import { useAuth } from '@presenters/auth/AuthContext';

export default function ProjectItem({ item, index, onPress, listLength, color }: { item: IProject; index: number; onPress: () => void; listLength?: number; color: string }) {
	const { styles } = useStyles(stylesheet);
	const { loginType, permissions } = useAuth();
	const allowed = loginType === 'studio' ? permissions?.includes('Messages::View') : true;

	return (
		<Pressable style={styles.container} onPress={allowed ? onPress : () => {}}>
			<View style={styles.borderContainer}>
				<View style={styles.iconContainer(index, listLength, color)} />
				<View>
					<Text size="bodyBig" color="regular">
						{item.project_name}
					</Text>
					<Text size="bodySm" color="muted">
						{item?.locations ? item.locations?.join(', ') : item?.location?.map(it => it?.name)?.join(', ')}
					</Text>
				</View>
			</View>
		</Pressable>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		height: 60,
		borderColor: theme.colors.borderGray,
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
	},
	borderContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
		gap: theme.gap.base,
		marginHorizontal: theme.margins.base,
		borderColor: theme.colors.borderGray,
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
	},
	iconContainer: (index: number, listLength: number = 1, color: string) => ({
		width: 8,
		height: 60,
		backgroundColor: color,
		opacity: 1 - index / listLength,
	}),
}));
