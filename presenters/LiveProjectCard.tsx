import { useNavigation } from '@react-navigation/native';
import { LocationManager } from '@touchblack/icons';
import { Text } from '@touchblack/ui';
import { Pressable, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface IProps {
	project: any;
	index: number;
}

export default function LiveProjectCard({ project, index }: IProps) {
	const { styles, theme } = useStyles(stylesheet);
	const navigation = useNavigation();

	function handleItemPress() {
		navigation.navigate('ProjectDetails', { project_name: project?.project_name, project_id: project?.id, project_status: project?.status });
	}

	return (
		<Pressable
			onPress={handleItemPress}
			style={{
				width: 180,
				borderLeftWidth: index === 0 ? theme.borderWidth.slim : 0,
				borderRightWidth: theme.borderWidth.slim,
				borderColor: theme.colors.borderGray,
				justifyContent: 'space-between',
			}}>
			<View
				style={{
					padding: theme.padding.xs,
					gap: theme.gap.xxs,
				}}>
				<Text size="bodyBig" color="regular">
					{project.project_name}
				</Text>
				<Text size="bodyMid" color="regular">
					{project.brand?.name}
				</Text>
			</View>
			<View
				style={{
					borderTopWidth: theme.borderWidth.slim,
					borderColor: theme.colors.borderGray,
					padding: theme.padding.xs,
					flexDirection: 'row',
					alignItems: 'center',
					gap: theme.gap.xxxs,
				}}>
				<LocationManager size="24" />
				<Text size="bodyBig" color="regular">
					{project.location?.[0]?.name}
				</Text>
			</View>
		</Pressable>
	);
}

const stylesheet = createStyleSheet(theme => ({}));
