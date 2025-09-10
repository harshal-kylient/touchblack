import React from 'react';
import { View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const SearchBarPlaceholder: React.FC = () => {
	return (
		<SkeletonPlaceholder highlightColor="#000" backgroundColor="#393939">
			<SkeletonPlaceholder.Item borderWidth={1} borderColor={'white'} marginTop={24} marginHorizontal={16}>
				<View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
					<SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
						<SkeletonPlaceholder.Item width={24} height={24} marginHorizontal={16} marginVertical={12} />
						<SkeletonPlaceholder.Item width={113} height={16} />
					</SkeletonPlaceholder.Item>
					<View style={{ width: 48, height: 48, backgroundColor: '#1C1A1F', borderLeftWidth: 1, borderColor: 'white' }}>
						<SkeletonPlaceholder.Item height={24} width={24} margin={12} />
					</View>
				</View>
			</SkeletonPlaceholder.Item>
		</SkeletonPlaceholder>
	);
};

export default SearchBarPlaceholder;
