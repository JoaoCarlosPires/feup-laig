/**
 * GamePiece
 * @constructor
 * @param scene - Reference to MyScene object
 */
class GamePiece extends CGFobject {
	constructor(scene, id, color) {
        super(scene);

        this.id = id;

        this.color = color;
        if (color == "redpiece") {
            this.texture = new CGFtexture(scene, "./scenes/images/piece2.jpg");
        } else {
            this.texture = new CGFtexture(scene, "./scenes/images/piece1.jpg");
        }
        
        this.body = new MyCylinder(scene, 1, 1, 3, 50, 50);

        this.base = new MyCylinderBase(scene, 50, 1);
        this.top = new MyCylinderBase(scene, 50, 1);
        
        this.matrix = mat4.create();

        this.translateAux = vec3.fromValues(0, 0, 3);
        this.translate = mat4.create();
        this.rotate = mat4.create();

        mat4.translate(this.translate, this.translate, this.translateAux);
        mat4.rotateY(this.rotate, this.rotate, 180);
        mat4.multiply(this.matrix, this.matrix, this.translate);
        mat4.multiply(this.matrix, this.matrix, this.rotate);

        this.movement = mat4.create();
        this.move = mat4.create();
        this.initial = vec3.fromValues(0, 0, 0);
        this.finalX = 0;
        this.finalY = 0;

        this.selected = false;

    }

    display() {
        this.scene.registerForPick(this.id, this);
        var material = new CGFappearance(this.scene);
        material.setTexture(this.texture);
        material.apply();

        this.scene.pushMatrix();
        this.scene.multMatrix(this.move);
        this.scene.multMatrix(this.movement);
        this.body.display();
       
        this.scene.pushMatrix();
        this.scene.multMatrix(this.rotate);
        this.base.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.multMatrix(this.translate);
        this.top.display();
        this.scene.popMatrix();
        this.scene.popMatrix();             
    }

    colorChange() {
        this.texture = this.color == "redpiece" ? new CGFtexture(this.scene, "./scenes/images/piece1.jpg") : new CGFtexture(this.scene, "./scenes/images/piece2.jpg");
        this.color = this.color == "redpiece" ? "whitepiece" : "redpiece";
    }

    changeColor() {
        if (this.selected) {
            this.texture = new CGFtexture(this.scene, "./scenes/images/piece.jpg");
        } else {
            this.texture = this.color == "redpiece" ? new CGFtexture(this.scene, "./scenes/images/piece2.jpg") : new CGFtexture(this.scene, "./scenes/images/piece1.jpg"); 
        }
    }

    getColor() {
        return this.color;
    }

    getYCoord(id) {
        if (id <= 4) return 0;
        else if (id <= 8) return 1;
        else if (id <= 12) return 2;
        else return 3;
    }

    getXCoord(id) {
        if (id == 1 || id == 5 || id == 9 || id == 13) return 0;
        else if (id == 2 || id == 6 || id == 10 || id == 14) return 1;
        else if (id == 3 || id == 7 || id == 11 || id == 15) return 2;
        else return 3;
    }

    changePosition(newId) {
        var diffZ = (this.scene.numPieces[newId] - this.scene.numPieces[this.id]) + 1;

        var translate = vec3.fromValues(0, 0, 3 * diffZ);
        var translation = mat4.create();
        mat4.translate(translation, translation, translate);
        mat4.multiply(this.movement, this.movement, translation);

        this.id = newId;
    }

    changeZ() {
        var diffZ = this.scene.numPieces[this.id] - 1;

        var translate = vec3.fromValues(0, 0, 3 * diffZ);
        var translation = mat4.create();
        mat4.translate(translation, translation, translate);
        mat4.multiply(this.movement, this.movement, translation);        
    }

    getPosX(id) {
        if (id < 5) return 1;
        else if (id < 9) return 2;
        else if (id < 13) return 3;
        return 4;
    }

    getPosY(id) {
        if (id == 1 || id == 5 || id == 9 || id == 13) return 1;
        else if (id == 2 || id == 6 || id == 10 || id == 14) return 2;
        else if (id == 3 || id == 7 || id == 11 || id == 15) return 3;
        return 4;
    }

    getFinalPos(newId) {        
        this.finalX = this.getPosX(newId) - this.getPosX(this.id);
        this.finalY = this.getPosY(newId) - this.getPosY(this.id);
    }

    getFinal(newId) {
        if (this.color == "redpiece") {
            switch (this.getPosY(this.id)) {
                case 1:
                    this.finalY = this.getPosY(this.id) - 7;
                    break;
                case 2:
                    this.finalY = this.getPosY(this.id) - 3;
                    break;
                case 3:
                    this.finalY = this.getPosY(this.id) + 1;
                    break;
                case 4: 
                    this.finalY = this.getPosY(this.id) + 5;
                    break;
            }
    
            switch (this.getPosX(this.id)) {
                case 1:
                    this.finalX = this.getPosX(this.id) - 20;
                    break;
                case 2:
                    this.finalX = this.getPosX(this.id) - 17;
                    break;
                case 3:
                    this.finalX = this.getPosX(this.id) - 15;
                    break;
                case 4:
                    this.finalX = this.getPosX(this.id) - 12;
                    break;
            }     
        } else {
            switch (this.getPosY(this.id)) {
                case 1:
                    this.finalY = this.getPosY(this.id) - 7;
                    break;
                case 2:
                    this.finalY = this.getPosY(this.id) - 3;
                    break;
                case 3:
                    this.finalY = this.getPosY(this.id) + 1;
                    break;
                case 4: 
                    this.finalY = this.getPosY(this.id) + 5;
                    break;
            }
    
            switch (this.getPosX(this.id)) {
                case 1:
                    this.finalX = this.getPosX(this.id) + 12;
                    break;
                case 2:
                    this.finalX = this.getPosX(this.id) + 15;
                    break;
                case 3:
                    this.finalX = this.getPosX(this.id) + 17;
                    break;
                case 4:
                    this.finalX = this.getPosX(this.id) + 20;
                    break;
            }     
        }
           
    }

    update(time) {
        if (time > 1) {
            this.move = mat4.create();
            return false;
        }
        
        var delta = (time)/(2);

        var translate = vec3.create();
        var translateM = mat4.create();
        var final = vec3.fromValues(this.finalX, this.finalY, (3 * this.scene.numPieces[this.id]));

        vec3.subtract(translate, final, this.initial);
        vec3.multiply(translate, translate, vec3.fromValues(delta, delta, delta));
        vec3.add(translate, translate, this.initial);
        mat4.translate(translateM, translateM, translate);
        mat4.multiply(this.move, this.move, translateM); 

        return true;
    }
}

