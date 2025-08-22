import { useState } from 'react';
import { StyleProp, ViewStyle, useWindowDimensions } from 'react-native';
import { TabView as RnTabView, TabBar } from 'react-native-tab-view';

import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface ICustomTabViewProps {
	sceneBgColor: any;
	routeTab?: Array<{ key: string; title: string }>;
	renderScene: (props: any) => React.ReactNode;
	FirstRoute?: () => React.JSX.Element;
	SecondRoute?: () => React.JSX.Element;
	ThirdRoute?: () => React.JSX.Element;
	onIndexChange?: (index: number) => void;
	sceneStyles?: StyleProp<ViewStyle>;
}

function CustomTabView({ onIndexChange, sceneBgColor, routeTab = [], renderScene, sceneStyles }: ICustomTabViewProps) {
	const { styles } = useStyles(stylesheet);
	const layout = useWindowDimensions();
	const [index, setIndex] = useState<number>(0);
	const [routes] = useState(routeTab);

	const handleIndexChange = (idx: number) => {
		setIndex(idx);
		if (onIndexChange) {
			onIndexChange(idx);
		}
	};

	const renderTabBar = (props: any) => <TabBar {...props} indicatorStyle={styles.indicator} style={styles.container} activeColor="#E9BF99" labelStyle={styles.noTextTransform} />;

	return <RnTabView navigationState={{ index, routes }} renderScene={renderScene} onIndexChange={handleIndexChange} initialLayout={{ width: layout.width, height: 800 }} sceneContainerStyle={[{ backgroundColor: sceneBgColor }, sceneStyles]} renderTabBar={renderTabBar} />;
}

export { CustomTabView, type ICustomTabViewProps };

const stylesheet = createStyleSheet(theme => ({
	indicator: {
		top: 0.5,
		backgroundColor: theme.colors.black,
		height: '101%',
		borderTopColor: theme.colors.borderGray,
		borderLeftColor: theme.colors.borderGray,
		borderWidth: theme.borderWidth.slim,
		borderRightColor: theme.colors.borderGray,
		borderBottomColor: theme.colors.black,
	},
	container: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		marginHorizontal: 16,
	},
	noTextTransform: {
		textTransform: 'none',
	},
}));
