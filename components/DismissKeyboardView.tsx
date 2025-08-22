import { ReactNode } from 'react';
import { TouchableWithoutFeedback, Keyboard, View, ViewProps } from 'react-native';

type Props = {
	children: ReactNode;
};

const DismissKeyboardHOC = <P extends object>(Comp: React.ComponentType<P>) => {
	const WrappedComponent: React.FC<P & Props> = ({ children, ...props }) => (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
			<Comp {...(props as P)}>{children}</Comp>
		</TouchableWithoutFeedback>
	);

	return WrappedComponent;
};

const DismissKeyboardView = DismissKeyboardHOC<ViewProps>(View);

export default DismissKeyboardView;
