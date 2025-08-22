import React from 'react';
import { View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const ProfileHeaderPlaceholder: React.FC = () => {
	return (
		<SkeletonPlaceholder highlightColor="#000" backgroundColor="#393939">
			<SkeletonPlaceholder.Item marginVertical={24} marginHorizontal={16}>
				<View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
					<SkeletonPlaceholder.Item flexDirection="row" alignItems="center" gap={16}>
						<SkeletonPlaceholder.Item width={24} height={24} />
						<SkeletonPlaceholder.Item width={123} height={16} />
					</SkeletonPlaceholder.Item>
					<View style={{ flexDirection: 'row', gap: 16, paddingVertical: 4 }}>
						<SkeletonPlaceholder.Item height={24} width={24} />
						<SkeletonPlaceholder.Item height={24} width={24} />
					</View>
				</View>
			</SkeletonPlaceholder.Item>
		</SkeletonPlaceholder>
	);
};

export default ProfileHeaderPlaceholder;
