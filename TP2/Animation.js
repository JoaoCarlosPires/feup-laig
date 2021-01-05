/**
 * Animation
 * @constructor
 */

class Animation {
    constructor() {
        
        if (this.constructor === Animation) {
            throw new TypeError('Abstract class "Animation" cannot be instantiated directly.'); 
        }

        if (this.update === undefined) {
            throw new TypeError('Classes extending the Animation abstract class');
        }

        if (this.apply === undefined) {
            throw new TypeError('Classes extending the Animation abstract class');
        }
    }
}