
export default class Functions {
	constructor () {}
	static fullScreen (element) {
		if(element.requestFullscreen) {
			element.requestFullscreen();
		} else if(element.webkitRequestFullscreen) {
			element.webkitRequestFullscreen();
		} else if(element.mozRequestFullscreen) {
			element.mozRequestFullScreen();
		}
	}

	static fullScreenCancel() {
		if(document.exitFullscreen) {
			document.exitFullscreen();
		} else if(document.webkitExitFullscreen ) {
			document.webkitExitFullscreen();
		}
	}

	static isInFullScreen () {
		return (document.fullscreenElement && document.fullscreenElement !== null) ||
			(document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
			(document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
			(document.msFullscreenElement && document.msFullscreenElement !== null);
	}}
