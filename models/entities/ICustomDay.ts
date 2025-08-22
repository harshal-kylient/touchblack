import { DateData } from 'react-native-calendars';

export interface ICustomDay {
	date: DateData;
	state: string;
	marking: IMarking;
	onPress: (date: DateData) => void;
	height?: number;
}
