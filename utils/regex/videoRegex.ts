const ytRegex = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
const fbRegex = /(?:https?:\/\/(?:www\.)?facebook\.com\/(?:video\.php\?v=|watch\/?\?v=)?(\d+)[/\w.-]*)|(?:https?:\/\/(?:www\.)?facebook\.com\/(?:[-\w.]+\/videos\/|video\.php\?id=)(\d+)[/\w.-]*)|(?:https?:\/\/m\.facebook\.com\/story\.php\?story_fbid=(\d+)&id=[-\w.]+)|(?:https?:\/\/fb\.watch\/(\w+)\/)|(?:https?:\/\/video\.xx\.fbcdn\.net\/v\/(\d+)\.mp4\?_nc_cat=\d+&_nc_ohc=[-\w]+)|(?:https?:\/\/)?facebook\.com\/share\/v\/(\w+)\/?/gi;
const vimeoRegex = /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/g;
export { ytRegex, fbRegex, vimeoRegex };
