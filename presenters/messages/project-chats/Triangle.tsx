import { View, ViewStyle } from 'react-native';

interface IProps {
	size: number;
	color: string;
	style?: ViewStyle;
	sentByMe: boolean;
}

export const Triangle = ({ size, color, style, sentByMe }: IProps) => {
	const alignSelf = sentByMe ? 'flex-end' : 'flex-start';
	const borderLeftWidth = sentByMe ? size : 0;
	const borderRightWidth = sentByMe ? 0 : size;

	return (
		<View
			style={[
				{
					width: 0,
					height: 0,
					backgroundColor: 'transparent',
					borderStyle: 'solid',
					borderLeftWidth: borderLeftWidth,
					borderRightWidth: borderRightWidth,
					borderTopWidth: size,
					borderLeftColor: 'transparent',
					borderTopColor: color,
					alignSelf: alignSelf,
				},
				style,
			]}
		/>
	);
};
