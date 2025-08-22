import EnumProjectStatus from '@models/enums/EnumProjectStatus';
import { useAuth } from '@presenters/auth/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Success } from '@touchblack/icons';
import { Button, Text } from '@touchblack/ui';
import { View } from 'react-native';
import { useStyles } from 'react-native-unistyles';

export default function ClaimCompleteMessage({ item, status, project_id, conversation_id }) {
	const navigation = useNavigation();
	const { theme } = useStyles();
	const { loginType } = useAuth();

	const isDisabled = status !== EnumProjectStatus.Completed;

	function handleRaiseClaim() {
		navigation.navigate('RaiseClaim', { project_id, conversation_id, type: 'selectedTalent' });
	}

	return (
		<View>
			<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: theme.padding.sm, paddingHorizontal: theme.padding.sm, backgroundColor: 'rgba(0,0,0,0.5)', borderBottomWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
				<Text size="bodyBig" color="regular">
					Voila, Project Completed!
				</Text>
				<Success size="24" color={theme.colors.success} />
			</View>
			<Text size="bodyBig" color="regular" style={{ padding: theme.padding.base }}>
				{item?.content}
			</Text>
			{(loginType === 'talent' || loginType === 'manager') && (
				<Button isDisabled={isDisabled} onPress={handleRaiseClaim}>
					Raise Claim
				</Button>
			)}
		</View>
	);
}
