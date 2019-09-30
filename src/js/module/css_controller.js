/**
 * @class
 * This class is a module to inject rule for css
 */
export default class CssController {
    /**
	 * @returns {CssController}
	 */
	static getInstance = () => {
		if (!CssController.instance) {
			CssController.instance = new CssController();
		}
		return CssController.instance;
    };
    
    init = ()=> {
        Promise.all([
            this._createStyleElement(),
            this._addRuleBody()
        ]);    
    }

    /**
     * create style tag and append it to head tag
     * @private
     */
    _createStyleElement = ()=>{
        return new Promise((resolve, reject) => {
            this.styleElement = document.createElement('style');
            document.head.appendChild(this.styleElement);   

            this.totalRule = 0;

            this.styleElement.onload = ()=> resolve();
            this.styleElement.onerror = (e) => reject(e);
		});
    }

    /**
     * add css rule for body
     * @private
     */
    _addRuleBody = ()=>{
        let cssRuleBody = `
        body
        {
            margin: 0px 0px 0px 0px;
            height: 100%;
            overflow-y: hidden;
            overflow-x: hidden;
        }
        `

        return this.addRule(cssRuleBody);
    }

    /**
     * add new CSS rule
     * @param {string} rule
     */
    addRule = (rule)=>{
        return new Promise((resolve, reject) => {
            this.styleElement.sheet.insertRule(rule,this.totalRule);

            this.styleElement.onload = ()=> 
            {
                this.totalRule++;

                resolve();
            }

            this.styleElement.onerror = (e) => reject(e);
        });
    }
}