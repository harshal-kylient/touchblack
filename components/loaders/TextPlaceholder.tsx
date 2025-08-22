import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const TextPlaceholder = ({ numberOfLines = 1, customWidth = 239, customHeight = 24 }: { numberOfLines?: number; customWidth?: number; customHeight?: number }) => {
	return (
		<SkeletonPlaceholder highlightColor="#000" backgroundColor="#393939">
			<>
				{Array.from({ length: numberOfLines }).map((_, index) => (
					<SkeletonPlaceholder.Item key={index} marginTop={20} marginHorizontal={16}>
						<SkeletonPlaceholder.Item flexDirection="row" alignItems="center" justifyContent="space-between">
							<SkeletonPlaceholder.Item width={customWidth} height={customHeight} />
						</SkeletonPlaceholder.Item>
					</SkeletonPlaceholder.Item>
				))}
			</>
		</SkeletonPlaceholder>
	);
};

export default TextPlaceholder;
