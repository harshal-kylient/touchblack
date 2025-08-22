import LabelWithTouchableIcon from '@components/LabelWithTouchableIcon';
import useGetProjectsCount from '@network/useGetProjectCounts';
import { useNavigation } from '@react-navigation/native';
import { Text } from '@touchblack/ui';
import { TouchableOpacity, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useProjectsContext, ViewType } from './projects/ProjectContext';

export default function ProjectCount() {
	const navigation = useNavigation();
	const { styles, theme } = useStyles(stylesheet);
	const { data } = useGetProjectsCount();
	const { dispatch, state } = useProjectsContext();
	const handleRadioPress = (inputNumber: number) => {
		let openStatus = null;

		switch (inputNumber) {
			case 1:
				openStatus = 'Enquiry';
				break;
			case 2:
				openStatus = 'Tentative';
				break;
			case 3:
				openStatus = 'Confirmed';
				break;
			default:
				openStatus = null;
		}

		handleViewChange(ViewType.LIST);
		navigation.navigate('TabNavigator', {
			screen: 'Calendar',
			params: { openStatus },
		});
	};
	const handleViewChange = (viewType: ViewType) => {
		dispatch({ type: 'ACTIVE_VIEW', value: viewType });
	};
	return (
		<>
			<LabelWithTouchableIcon onPress={() => navigation.navigate('TabNavigator', { screen: 'Calendar' })} label="Projects" style={{ marginTop: theme.margins.xxxl, marginBottom: theme.margins.base }} />

			<View style={{ flexDirection: 'row', borderTopWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, borderBottomWidth: theme.borderWidth.slim }}>
				<TouchableOpacity onPress={() => handleRadioPress(1)} style={{ flexDirection: 'row', gap: theme.gap.xxs, alignItems: 'center', paddingVertical: theme.padding.base, justifyContent: 'center', flex: 1, borderRightWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
					<Text size="bodyBig" color="regular">
						Enquiry
					</Text>
					<View style={{ width: 22, height: 22, borderRadius: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.success }}>
						<Text style={{ fontFamily: theme.fontFamily.cgBold, fontWeight: 'bold' }} size="bodyMid" color="black">
							{`${data?.data?.Enquiry || 0}`.padStart(2, '0')}
						</Text>
					</View>
				</TouchableOpacity>

				<TouchableOpacity onPress={() => handleRadioPress(2)} style={{ flexDirection: 'row', gap: theme.gap.xxs, alignItems: 'center', paddingVertical: theme.padding.base, justifyContent: 'center', flex: 1, borderRightWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
					<Text size="bodyBig" color="regular">
						Tentative
					</Text>
					<View style={{ width: 22, height: 22, borderRadius: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.primary }}>
						<Text style={{ fontFamily: theme.fontFamily.cgBold, fontWeight: 'bold' }} size="bodyMid" color="black">
							{`${data?.data?.Tentative || 0}`.padStart(2, '0')}
						</Text>
					</View>
				</TouchableOpacity>

				<TouchableOpacity onPress={() => handleRadioPress(3)} style={{ flexDirection: 'row', gap: theme.gap.xxs, alignItems: 'center', paddingVertical: theme.padding.base, justifyContent: 'center', flex: 1 }}>
					<Text size="bodyBig" color="regular">
						Confirmed
					</Text>
					<View style={{ width: 22, height: 22, borderRadius: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.destructive }}>
						<Text style={{ fontFamily: theme.fontFamily.cgBold, fontWeight: 'bold' }} size="bodyMid" color="black">
							{`${data?.data?.Confirmed || 0}`.padStart(2, '0')}
						</Text>
					</View>
				</TouchableOpacity>
			</View>
		</>
	);
}

const stylesheet = createStyleSheet(theme => ({}));
