import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import WorkedWithListItem from './WorkedWithListItem';
import { UnistylesRuntime, useStyles } from 'react-native-unistyles';
import server from '../../../utils/axios';
import CONSTANTS from '../../../constants/constants';

function WorkedWithListRenderer() {
	const { theme } = useStyles();
	const [loading, setLoading] = useState<boolean>(true);
	const [workedWithList, setWorkedWithList] = useState<[]>([]);

	useEffect(() => {
		const fetchWorkedWithList = async () => {
			try {
				const response = await server.get(CONSTANTS.endpoints.worked_with);
				if (response.status === 200) {
					setWorkedWithList(response.data.data || []);
				}
			} catch (error) {
			} finally {
				setLoading(false);
			}
		};
		fetchWorkedWithList();
	}, []);

	return loading ? (
		<ActivityIndicator size="small" color={theme.colors.primary} />
	) : (
		<View style={{ width: UnistylesRuntime.screen.width }}>
			{workedWithList.map((item, index) => (
				<WorkedWithListItem key={index} item={item} index={index} />
			))}
		</View>
	);
}

export default WorkedWithListRenderer;
