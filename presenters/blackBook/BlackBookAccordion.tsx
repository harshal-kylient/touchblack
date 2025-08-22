import React from 'react';
import { FlashList } from '@shopify/flash-list';

import TalentThumbnailCard from '@components/TalentThumbnailCard';
import { IBlackBookProfile } from '@models/entities/IBlackBookProfile';
import useArchiveBlackBook from '@network/useArchiveBlackBook';
import { IProfessionData } from '@models/dtos/IProfessionData';
import { useAuth } from '@presenters/auth/AuthContext';

interface BlackBookAccordionProps {
	profession: IProfessionData;
}

const BlackBookAccordion: React.FC<BlackBookAccordionProps> = ({ profession }) => {
	const { handleArchive } = useArchiveBlackBook();
	const { loginType, userId, businessOwnerId } = useAuth();
	const editAllowed = loginType === 'producer' ? userId === businessOwnerId : true;

	return <FlashList data={profession.content} estimatedItemSize={64} renderItem={({ item, index }: { item: IBlackBookProfile; index: number }) => <TalentThumbnailCard key={index} item={item} lastItem={index === profession.content?.length - 1} onArchive={editAllowed ? handleArchive : undefined} />} />;
};

export default BlackBookAccordion;
