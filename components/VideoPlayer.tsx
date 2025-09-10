import { Dimensions, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import WebView from 'react-native-webview';
import YoutubeIframe from 'react-native-youtube-iframe';

type VideoType = string;
type VideoID = string;

export interface IProps {
	videoinfo: [VideoType, VideoID];
	noBorder?: boolean;
}

const vimeoHtml = (videoId: string) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<div style="background-color: '#000 !important'"><iframe src="https://player.vimeo.com/video/${videoId}?autoplay=1&title=0&byline=0&portrait=0" style="background-color: black !important; position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>
</html>`;

const facebookHtml = (videoUrl: string) => `<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style='padding:0 !important; margin:0 !important; overflow: hidden !important;'>
	<div id="fb-root"></div>
	<script async defer src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.2"></script>
	<div class="fb-video" data-href="${videoUrl}" style='width:100% ; height:100vh; background-color: black !important' data-height='232' data-show-text="false" data-controls="true" data-autoplay="true" data-allowfullscreen="true"></div>
</body>
</html>`;

export default function VideoPlayer({ videoinfo, noBorder = false }: IProps) {
	const { styles } = useStyles(stylesheet);

	return (
		<View style={styles.container(noBorder)}>
			{videoinfo[0] === 'youtube' ? (
				<YoutubeIframe height={232} width={Dimensions.get('window').width} play={true} videoId={videoinfo[1]} />
			) : (
				<WebView
					style={styles.webviewContainer}
					source={
						videoinfo[0] === 'vimeo'
							? { html: vimeoHtml(videoinfo[1]) }
							: // : { uri: convertFacebookVideoUrlToEmbed(videoinfo[1]) }
							  { html: facebookHtml(videoinfo[1]) }
					}
					allowsFullscreenVideo={true}
					allowsInlineMediaPlayback={true}
					mediaPlaybackRequiresUserAction={false}
					javaScriptEnabled={true}
					injectedJavaScript={'document.getElementsByTagName("video")[0].play();'}
				/>
			)}
		</View>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: (noBorder: boolean) => ({
		borderTopWidth: noBorder ? 0 : theme.borderWidth.slim,
		borderBottomWidth: noBorder ? 0 : theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		justifyContent: 'center',
		flex: 1,
		width: '100%',
		height: 232,
	}),
	vimeoContainer: {
		height: 232,
		width: Dimensions.get('window').width,
		overflow: 'hidden',
	},
	webviewContainer: { height: 232, width: Dimensions.get('window').width },
}));
