import React from 'react';
import { View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

const ProfilePlaceholder: React.FC = () => {
	const { styles } = useStyles(stylesheet);

	return (
		<View style={styles.container}>
			<SkeletonPlaceholder direction="right" highlightColor="#000" backgroundColor="#393939">
				<SkeletonPlaceholder.Item flexDirection="column">
					<View style={styles.listContainer}>
						<SkeletonPlaceholder.Item flexDirection="row">
							<SkeletonPlaceholder.Item width={113} height={113} />
							<View style={styles.textWrapper}>
								<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'stretch' }}>
									<SkeletonPlaceholder.Item width={120} height={24} marginTop={11} />
									<SkeletonPlaceholder.Item style={{ alignSelf: 'flex-end' }} width={24} height={24} />
								</View>
								<SkeletonPlaceholder.Item marginTop={8} width={24} height={18} />
							</View>
						</SkeletonPlaceholder.Item>
					</View>
				</SkeletonPlaceholder.Item>
			</SkeletonPlaceholder>
		</View>
	);
};

const stylesheet = createStyleSheet(theme => ({
	container: {
		borderColor: theme.colors.borderGray,
		borderTopWidth: 0.8,
		borderBottomWidth: 0.8,
		marginTop: theme.margins.xxl,
	},
	listContainer: {
		marginLeft: theme.margins.base,
		borderLeftWidth: 1,
		borderBottomWidth: 1,
		borderColor: theme.colors.borderGray,
	},
	textWrapper: {
		flexDirection: 'column',
		paddingHorizontal: theme.padding.base,
		flex: 1,
		justifyContent: 'center',
	},
	iconWrapper: {
		flexDirection: 'row',
		marginVertical: 20,
		gap: theme.gap.base,
	},
}));

export default ProfilePlaceholder;
