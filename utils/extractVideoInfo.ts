import { IProps as IVideoInfo } from '@components/VideoPlayer';
import { fbRegex, ytRegex } from './regex';

export default function extractVideoInfo(videoUrl: string): IVideoInfo['videoinfo'] {
	let videoInfo: IVideoInfo['videoinfo'] = ['', ''];

	if (videoUrl?.includes('vimeo.com')) {
		videoInfo[0] = 'vimeo';
		// @ts-ignore
		videoInfo[1] = videoUrl?.split('/').pop();
		return videoInfo;
	}

	const fbMatch = videoUrl?.match(fbRegex);
	if (fbMatch) {
		videoInfo[0] = 'facebook';
		videoInfo[1] = videoUrl;
		return videoInfo;
	}

	const ytMatch = videoUrl?.match(ytRegex);
	if (ytMatch && ytMatch[1]) {
		videoInfo[0] = 'youtube';
		videoInfo[1] = ytMatch[1];
		return videoInfo;
	}
	return ['facebook', videoUrl];
}
