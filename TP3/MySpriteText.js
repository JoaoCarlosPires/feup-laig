/**
 * MySpriteText
 * @constructor
 */

class MySpriteText {
    constructor(scene, text) {
        this.scene = scene;

        this.text = text;

        this.rectangle = new MyRectangle(this.scene, 0, 0, 1, 1, 1.0, 1.0);
        
        this.sprite = new MySpriteSheet(this.scene, "./scenes/images/letters1.png", 13, 6);

        this.letters = [];
        for (var i = 0; i < this.text.length; i++) {
            var pos = this.getCharacterPosition(this.text.charAt(i));
            this.letters.push(pos);
        }

        this.matrix = mat4.create();
    }

    changeText(newText) {
        this.text = newText;
        this.letters = [];
        for (var i = 0; i < this.text.length; i++) {
            var pos = this.getCharacterPosition(this.text.charAt(i));
            this.letters.push(pos);
        }
    }

    getCharacterPosition(character) {
        
        if (character == " ") {
            return ;
        }

        switch(character) {
            case '.':
                return 62;
            case ',':
                return 63;
            case '!':
                return 64;
            case '?':
                return 65;
            case '@':
                return 67;
            case '#':
                return 68;
            case '$':
                return 69;
            case '%':
                return 70;
            case '&':
                return 71;
            case '(':
                return 72;
            case ')':
                return 73;
            case '/':
                return 74;
            case '-':
                return 75;
            case '+':
                return 76;
            case '=':
                return 77;
            
        }

        if (character.charCodeAt(0) == 39) { // singlequote
            return 66;
        } else if (character >= '0' && character <= '9') { // 0-9
            return character.charCodeAt(0)+4;
        } else if (character.toUpperCase() == character) { // A-Z in UpperCase
            return character.charCodeAt(0)-65;
        } else if (character.toLowerCase() == character) { // A-Z in LowerCase
            return character.charCodeAt(0)-71;
        }        
    }

    display() {
        this.matrix = mat4.create();
        mat4.rotateZ(this.matrix, this.matrix, 90 * (Math.PI/180));
        for (var i = 0; i < this.letters.length; i++) {
            this.sprite.activateCellP(this.letters[i]);
            var translation = vec3.fromValues(1, 0, 0);
            mat4.translate(this.matrix, this.matrix, translation);
            this.scene.pushMatrix();
            this.scene.multMatrix(this.matrix);
            this.rectangle.display();  
            this.scene.popMatrix();
            this.scene.setActiveShaderSimple(this.scene.defaultShader);
            }
    }
}