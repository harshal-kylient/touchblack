import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@touchblack/ui';

import { FieldItem } from './FieldItem';
import { formatAmount } from '@utils/formatCurrency';
import { Success } from '@touchblack/icons';
import IMessageItem from '@models/entities/IMessageItem';
import { useAuth } from '@presenters/auth/AuthContext';

interface IProps {
	sender_name: string;
	item: IMessageItem;
}

export default function Confirmation({ sender_name, item }: IProps) {
	const { styles, theme } = useStyles(stylesheet);
	const { loginType } = useAuth();
	const isme = loginType === 'producer' ? item?.sender_type === 'producer' : loginType === 'talent' ? item?.sender_type === 'talent' : item?.sender_type === 'studio';

	const renderLabel = () => {
		return (
			<View style={{ maxWidth: '100%', flexDirection: 'row', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
				<Text size="bodyMid" color="regular">
					{`${isme ? 'You' : sender_name} confirmed the project at `}
				</Text>
				<Text size="bodyMid" weight="bold" color="regular">
					{formatAmount(item?.content?.negotiation?.amount)}
				</Text>
				<Success size={'24'} color={theme.colors.success} />
			</View>
		);
	};

	return (
		<View style={styles.body}>
			<FieldItem orientation="row" label={renderLabel()} value={''} style={[styles.field]} />
		</View>
	);
}

const stylesheet = createStyleSheet(theme => ({
	currentClaim: {
		gap: theme.gap.steps,
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: '#28251e',
		padding: theme.padding.xs,
		borderColor: '#fff4',
		borderTopWidth: theme.borderWidth.slim,
		alignItems: 'center',
	},
	currentClaimText: {},
	body: {
		maxWidth: '100%',
	},
	field: {
		paddingVertical: theme.padding.xs,
		paddingHorizontal: theme.padding.xs,
		borderTopWidth: theme.borderWidth.slim,
		borderTopColor: '#fff4',
		alignItems: 'center',
	},
}));
