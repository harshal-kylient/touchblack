// Not Active yet
import { Accordion, Text } from '@touchblack/ui';
import { useState } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { TouchableOpacity, View } from 'react-native';

const connectionTypes = [
	{
		type: '1st',
		description: 'People you have worked with.',
	},
	{
		type: '2nd',
		description: 'People connected to people who you have worked with.',
	},
	{
		type: '3rd',
		description: 'People connected to your 2nd level connections.',
	},
];

function ConnectionsFilter() {
	const { styles, theme } = useStyles(stylesheet);
	const [activeConnection, setActiveConnection] = useState(connectionTypes[0].type);

	const handleConnectionPress = (type: string) => {
		setActiveConnection(type);
	};

	return (
		<Accordion customStyles={{ paddingVertical: theme.padding.base }} title="Connections">
			<View style={styles.connectionTypesContainer}>
				{connectionTypes.map((connection, index) => {
					return (
						<TouchableOpacity onPress={() => handleConnectionPress(connection.type)} key={index} style={activeConnection === connection.type ? styles.activeConnectionContainer : styles.connectionContainer}>
							<Text color={activeConnection === connection.type ? 'regular' : 'muted'} size="bodyBig">
								{connection.type}
							</Text>
							<Text style={styles.textContainer} color={activeConnection === connection.type ? 'regular' : 'muted'} size="bodyMid">
								{connection.description}
							</Text>
						</TouchableOpacity>
					);
				})}
			</View>
		</Accordion>
	);
}

export default ConnectionsFilter;

const stylesheet = createStyleSheet(theme => ({
	connectionTypesContainer: {
		flexDirection: 'row',
		paddingHorizontal: theme.padding.base,
		gap: theme.gap.xs,
	},
	connectionContainer: {
		backgroundColor: theme.colors.backgroundLightBlack,
		padding: theme.padding.xs,
		gap: theme.gap.xxs,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	activeConnectionContainer: {
		backgroundColor: theme.colors.backgroundLightBlack,
		padding: theme.padding.xs,
		gap: theme.gap.xxs,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.typography,
	},
	textContainer: {
		maxWidth: 100,
	},
}));
