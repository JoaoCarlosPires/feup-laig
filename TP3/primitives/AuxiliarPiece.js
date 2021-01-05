/**
 * AuxiliarPiece
 * @constructor
 * @param scene - Reference to MyScene object
 */
class AuxiliarPiece extends CGFobject {
	constructor(scene) {
        super(scene);

        this.base = new MyCylinderBase(scene, 50, 1);
        this.top = new MyCylinderBase(scene, 50, 1);
        this.body = new MyCylinder(scene, 1, 1, 3, 50, 50);

        this.matrix = mat4.create();

        this.translateAux = vec3.fromValues(0, 0, 3);
        this.translate = mat4.create();
        this.rotate = mat4.create();

        mat4.translate(this.translate, this.translate, this.translateAux);
        mat4.rotateY(this.rotate, this.rotate, 180);
        mat4.multiply(this.matrix, this.matrix, this.translate);
        mat4.multiply(this.matrix, this.matrix, this.rotate);
    }

    display() {
        this.body.display();
        
        this.scene.pushMatrix();
        this.scene.multMatrix(this.rotate);
        this.base.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.multMatrix(this.translate);
        this.top.display();
        this.scene.popMatrix();    
    }
}