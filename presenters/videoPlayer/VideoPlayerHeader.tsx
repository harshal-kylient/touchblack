import { View } from 'react-native';

import { Menu as MenuIcon, Report as ReportIcon } from '@touchblack/icons';
import { MenuOption, MenuOptions, Menu, MenuTrigger } from 'react-native-popup-menu';
import { Text } from '@touchblack/ui';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import Header from '@components/Header';
import { useNavigation } from '@react-navigation/native';
import useGetUserDetailsById from '@network/useGetUserDetailsById';
import { useAuth } from '@presenters/auth/AuthContext';
import EnumReportType from '@models/enums/EnumReportType';
import capitalized from '@utils/capitalized';

interface IProps {
	filmId: UniqueId;
	filmName: string;
}

function VideoPlayerHeader({ filmId, filmName }: IProps) {
	const { styles, theme } = useStyles(stylesheet);
	const { loginType, userId, producerId } = useAuth();
	const { data: myData } = useGetUserDetailsById(loginType === 'talent' ? 'User' : 'Producer', loginType === 'talent' ? userId! : producerId!);
	const navigation = useNavigation();

	function handleReportFilm() {
		if (loginType === 'talent' && !myData?.email) {
			navigation.navigate('EmailInput', { filmId, type: EnumReportType.Film });
		} else navigation.navigate('ReasonInput', { filmId, type: EnumReportType.Film });
	}

	return (
		<Header name={capitalized(filmName)}>
			<View style={styles.container}>
				<Menu>
					<MenuTrigger>
						<MenuIcon size="24" strokeColor="white" strokeWidth={3} />
					</MenuTrigger>
					<MenuOptions customStyles={{
								optionsContainer: {
									backgroundColor: '#1C1A1F',
								},
							}}> 
						<MenuOption onSelect={handleReportFilm} style={{ padding: theme.padding.xs, flexDirection: 'row', gap: theme.gap.xs, alignItems: 'center' }}>
							<ReportIcon size="24" />
							<Text size="primarySm" color="regular">
								Report Film
							</Text>
						</MenuOption>
					</MenuOptions>
				</Menu>
			</View>
		</Header>
	);
}

export default VideoPlayerHeader;

const stylesheet = createStyleSheet(() => ({
	container: {
		flex: 1,
		maxWidth: '10%',
		justifyContent: 'flex-end',
		flexDirection: 'row',
	},
}));
