import IMessageItem from '@models/entities/IMessageItem';
import { useAuth } from '@presenters/auth/AuthContext';

export default function useSentByMe(item: IMessageItem) {
	const { loginType } = useAuth();
	return loginType === 'producer' ? item?.sender_type === 'producer' : loginType === 'studio' ? item?.sender_type === 'studio' : item?.sender_type === 'talent';
}
