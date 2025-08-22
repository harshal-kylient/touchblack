import { useState } from 'react';
import { Pressable, SafeAreaView, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Text as TextUi } from '@touchblack/ui';
import Header from '@components/Header';
import UpComingEventsList from './UpcomingEvents';
import PastEventsList from './PastEvents';

function EventsList() {
	const { styles, theme } = useStyles(stylesheet);

	const [activeTab, setActiveTab] = useState(0);

	return (
		<SafeAreaView style={styles.container}>
			<Header
				name="Events"
			/>
			<View style={{ paddingHorizontal: theme.padding.xs, borderBottomWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, flexDirection: 'row', justifyContent: 'space-between' }}>
				<Pressable
					onPress={() => {
						setActiveTab(0);
					}}
					style={{
						flex: 1,
						justifyContent: 'center',
						alignItems: 'center',
						backgroundColor: activeTab === 0 ? theme.colors.black : theme.colors.transparent,
						borderTopWidth: theme.borderWidth.slim,
						borderRightWidth: theme.borderWidth.slim,
						borderLeftWidth: theme.borderWidth.slim,
						borderColor: activeTab === 0 ? theme.colors.borderGray : theme.colors.transparent,
						paddingVertical: theme.padding.xs,
						position: 'relative',
					}}>
					<TextUi size="button" style={{ paddingHorizontal: 4 }} numberOfLines={1} color={activeTab === 0 ? 'primary' : 'regular'}>
						Upcoming
					</TextUi>
					<View style={styles.absoluteContainer(activeTab === 0)} />
				</Pressable>
				<Pressable
					onPress={() => {
						setActiveTab(1);
					}}
					style={{
						flex: 1,
						justifyContent: 'center',
						alignItems: 'center',
						backgroundColor: activeTab === 1 ? theme.colors.black : theme.colors.transparent,
						borderTopWidth: theme.borderWidth.slim,
						borderRightWidth: theme.borderWidth.slim,
						borderLeftWidth: theme.borderWidth.slim,
						borderColor: activeTab === 1 ? theme.colors.borderGray : theme.colors.transparent,
						paddingVertical: theme.padding.xs,
						position: 'relative',
					}}>
					<TextUi size="button" style={{ paddingHorizontal: 4 }} numberOfLines={1} color={activeTab === 1 ? 'primary' : 'regular'}>
						Past
					</TextUi>
					<View style={styles.absoluteContainer(activeTab === 1)} />
				</Pressable>
			</View>
			{activeTab === 0 && <UpComingEventsList />}
			{activeTab === 1 && <PastEventsList/> }
		</SafeAreaView>
	);
}

export default EventsList;

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
