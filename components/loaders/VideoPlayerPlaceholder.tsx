import { SafeAreaView, View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export default function VideoPlayerPlaceholder() {
	const { styles } = useStyles(stylesheet);

	return (
		<SafeAreaView style={styles.container}>
			<SkeletonPlaceholder direction="right" highlightColor="#000" backgroundColor="#393939">
				{/* Header with back button and title */}
				<SkeletonPlaceholder.Item flexDirection="row" justifyContent="space-between" alignItems="center" paddingHorizontal={16} paddingVertical={12}>
					{/* Back arrow */}
					<SkeletonPlaceholder.Item width={24} height={24} />

					{/* Title */}
					<SkeletonPlaceholder.Item width={100} height={20} />

					{/* Options button */}
					<SkeletonPlaceholder.Item width={24} height={24} />
				</SkeletonPlaceholder.Item>

				{/* Main Video Area */}
				<SkeletonPlaceholder.Item width={'100%'} height={200} marginTop={16} />

				{/* Video Info with Avatar */}
				<SkeletonPlaceholder.Item flexDirection="row" alignItems="center" paddingHorizontal={16} marginTop={16}>
					{/* Avatar */}
					<SkeletonPlaceholder.Item width={48} height={48} />

					{/* Video Title */}
					<SkeletonPlaceholder.Item flex={1} marginLeft={12}>
						<SkeletonPlaceholder.Item width={'80%'} height={16} />
						<SkeletonPlaceholder.Item width={'50%'} height={16} marginTop={8} />
					</SkeletonPlaceholder.Item>
				</SkeletonPlaceholder.Item>

				{/* Crew Section */}
				<SkeletonPlaceholder.Item marginTop={24} paddingHorizontal={16}>
					{/* Crew Title */}
					<SkeletonPlaceholder.Item width={'40%'} height={20} />

					{/* Search Crew */}
					<SkeletonPlaceholder.Item flexDirection="row" alignItems="center" marginTop={16}>
						{/* Search Icon */}
						<SkeletonPlaceholder.Item width={24} height={24} />

						{/* Search Placeholder */}
						<SkeletonPlaceholder.Item width={'80%'} height={20} marginLeft={12} />
					</SkeletonPlaceholder.Item>
				</SkeletonPlaceholder.Item>

				{/* Crew List Placeholder */}
				<SkeletonPlaceholder.Item marginTop={16} paddingHorizontal={16}>
					{/* Crew Member 1 */}
					<SkeletonPlaceholder.Item flexDirection="row" justifyContent="space-between" alignItems="center" marginTop={16}>
						{/* Avatar */}
						<SkeletonPlaceholder.Item width={24} height={24} />

						{/* Name */}
						<SkeletonPlaceholder.Item width={'70%'} height={16} />

						{/* Bookmark Icon */}
						<SkeletonPlaceholder.Item width={24} height={24} />
					</SkeletonPlaceholder.Item>

					{/* Crew Member 2 */}
					<SkeletonPlaceholder.Item flexDirection="row" justifyContent="space-between" alignItems="center" marginTop={16}>
						{/* Avatar */}
						<SkeletonPlaceholder.Item width={24} height={24} />

						{/* Name */}
						<SkeletonPlaceholder.Item width={'70%'} height={16} />

						{/* Bookmark Icon */}
						<SkeletonPlaceholder.Item width={24} height={24} />
					</SkeletonPlaceholder.Item>

					{/* Crew Member 3 */}
					<SkeletonPlaceholder.Item flexDirection="row" justifyContent="space-between" alignItems="center" marginTop={16}>
						{/* Avatar */}
						<SkeletonPlaceholder.Item width={24} height={24} />

						{/* Name */}
						<SkeletonPlaceholder.Item width={'70%'} height={16} />

						{/* Bookmark Icon */}
						<SkeletonPlaceholder.Item width={24} height={24} />
					</SkeletonPlaceholder.Item>

					{/* Crew Member 4 */}
					<SkeletonPlaceholder.Item flexDirection="row" justifyContent="space-between" alignItems="center" marginTop={16}>
						{/* Avatar */}
						<SkeletonPlaceholder.Item width={24} height={24} />

						{/* Name */}
						<SkeletonPlaceholder.Item width={'70%'} height={16} />

						{/* Bookmark Icon */}
						<SkeletonPlaceholder.Item width={24} height={24} />
					</SkeletonPlaceholder.Item>
				</SkeletonPlaceholder.Item>
			</SkeletonPlaceholder>
		</SafeAreaView>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		borderColor: theme.colors.borderGray,
		borderTopWidth: 0.8,
	},
}));
