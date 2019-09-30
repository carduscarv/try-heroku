/**
 * @class
 * This class is a module to load Fonts
 */
export default class LoaderController {
	/**
	 * @returns {LoaderController}
	 */
	static getInstance = () => {
		if (!LoaderController.instance) {
			LoaderController.instance = new LoaderController();
		}
		return LoaderController.instance;
	};

	init = () => {
		return new Promise((resolve, reject) => {
			resolve();
		});
	};

	/**
     * Load font by dynamic path
     * @param {Array<obj>} fonts
     * @example
     * fonts = [
     *      {
     *          key: 'key1'
     *          path : 'path1'
     *      },
     *      {
     *          key: 'key2'
     *          path : 'path2'
     *      }
     * ]
     */
	loadFonts = (fonts) => {
		return Promise.all(fonts.map((v) => this._loadFont(v.key, v.path)));
	};

	/**
     * Load Font
     * @private
     * @param {String} key
     * @param {String} path
     */
	_loadFont = (key, path) => {
		return new Promise((resolve, reject) => {
			var element = document.createElement('style');
			document.head.appendChild(element);

			var styles = '@font-face {font-family: ' + key + '; src: url("' + path + '");}';
			element.sheet.insertRule(styles, 0);

			document.fonts
				.load('10pt "' + key + '"')
				.then(() => resolve())
				.catch(() => reject('load font error :' + path));
		});
	};
}
