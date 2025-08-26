import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const DiscoverTitlePlaceholder: React.FC = () => {
	return (
		<SkeletonPlaceholder direction="right" highlightColor="#000" backgroundColor="#393939">
			<SkeletonPlaceholder.Item flexDirection="column" marginLeft={16} marginTop={13} gap={11}>
				<SkeletonPlaceholder.Item width={123} height={24} />
				<SkeletonPlaceholder.Item width={86} height={24} />
			</SkeletonPlaceholder.Item>
		</SkeletonPlaceholder>
	);
};

export default DiscoverTitlePlaceholder;
