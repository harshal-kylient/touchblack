import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const TextWithIconPlaceholder: React.FC = () => {
	return (
		<SkeletonPlaceholder highlightColor="#000" backgroundColor="#393939">
			<SkeletonPlaceholder.Item marginTop={20} marginHorizontal={16}>
				<SkeletonPlaceholder.Item flexDirection="row" alignItems="center" justifyContent="space-between">
					<SkeletonPlaceholder.Item width={239} height={24} />
					<SkeletonPlaceholder.Item width={24} height={24} />
				</SkeletonPlaceholder.Item>
			</SkeletonPlaceholder.Item>
		</SkeletonPlaceholder>
	);
};

export default TextWithIconPlaceholder;
