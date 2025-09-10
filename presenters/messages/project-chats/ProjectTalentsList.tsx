import { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, View } from 'react-native';
import Header from '@components/Header';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text as UIText } from '@touchblack/ui';
import TalentsList from './TalentsList';
import StudiosList from './StudiosList';

export default function ProjectTalentsList({ route }) {
	const { styles, theme } = useStyles(stylesheet);
	const projectId = route.params?.project_id;
	const projectName = route.params?.project_name;
	const hideTabs = route.params?.hideTabs;
	const tab = route.params?.tab || 0;
	const [activeTab, setActiveTab] = useState(tab);

	useEffect(() => {
		setActiveTab(tab);
	}, [tab]);

	function handleTabSwitch(value: number) {
		setActiveTab(value);
	}

	return (
		<>
			{hideTabs && activeTab === 0 ? (
				<TalentsList projectId={projectId} />
			) : hideTabs && activeTab === 1 ? (
				<StudiosList projectId={projectId} />
			) : (
				<SafeAreaView style={styles.container}>
					<Header name={projectName} />
					<View style={{ marginBottom: theme.margins.base, backgroundColor: theme.colors.black, paddingHorizontal: theme.padding.xs, borderBottomWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, flexDirection: 'row', justifyContent: 'space-between' }}>
						<Pressable onPress={() => handleTabSwitch(0)} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.black, borderTopWidth: theme.borderWidth.slim, borderRightWidth: theme.borderWidth.slim, borderLeftWidth: theme.borderWidth.slim, borderColor: activeTab === 0 ? theme.colors.borderGray : theme.colors.transparent, paddingVertical: theme.padding.xs, position: 'relative' }}>
							<UIText size="button" numberOfLines={1} color={activeTab === 0 ? 'primary' : 'regular'}>
								Talent Chats
							</UIText>
							<View style={styles.absoluteContainer(activeTab === 0)} />
						</Pressable>
						<Pressable onPress={() => handleTabSwitch(1)} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.black, borderTopWidth: theme.borderWidth.slim, borderRightWidth: theme.borderWidth.slim, borderLeftWidth: theme.borderWidth.slim, borderColor: activeTab === 1 ? theme.colors.borderGray : theme.colors.transparent, paddingVertical: theme.padding.xs, position: 'relative' }}>
							<UIText size="button" numberOfLines={1} color={activeTab === 1 ? 'primary' : 'regular'}>
								Studio Chats
							</UIText>
							<View style={styles.absoluteContainer(activeTab === 1)} />
						</Pressable>
					</View>
					{activeTab === 0 ? <TalentsList projectId={projectId} /> : <StudiosList projectId={projectId} />}
				</SafeAreaView>
			)}
		</>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.black,
	},
	absoluteContainer: (active: boolean) => ({
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: -1,
		height: 2,
		zIndex: 99,
		backgroundColor: active ? theme.colors.black : theme.colors.transparent,
	}),
}));
