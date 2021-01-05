/**
 * PassButton
 * @constructor
 * @param scene - Reference to MyScene object
 */
class PassButton extends CGFobject {
	constructor(scene, player) {
        super(scene);
        this.scene = scene;

        this.player = player;

        this.base = new MyRectangle(scene, -0.5, -0.5, 0.5, 0.5, 1, 1);
        this.baseMatrix = mat4.create();

        var aux = vec3.fromValues(0.15, 0.3, 1);
        mat4.scale(this.baseMatrix, this.baseMatrix, aux);

        this.texture = new CGFtexture(scene, "./scenes/images/chair.jpg");

        this.text = new MySpriteText(scene, "PASS");

        if (this.player == "1") {
            
            // Button Matrix

            this.matrix = mat4.create();
            
            var T = mat4.create();
            var auxT = vec3.fromValues(-0.4, 0.6, 0.29);
            mat4.translate(T, T, auxT);

            var R = mat4.create();
            mat4.rotateX(R, R, -90);

            var S = mat4.create();
            var auxS = vec3.fromValues(0.5, 0.7, 1);
            mat4.scale(S, S, auxS);

            mat4.multiply(this.matrix, this.matrix, T);
            mat4.multiply(this.matrix, this.matrix, R);
            mat4.multiply(this.matrix, this.matrix, S);
            
            // Text Matrix

            this.textMatrix = mat4.create();
            
            T = mat4.create();
            auxT = vec3.fromValues(0.05, -0.07, 0.2);
            mat4.translate(T, T, auxT);

            S = mat4.create();
            auxS = vec3.fromValues(0.1, 0.07, 0.1);
            mat4.scale(S, S, auxS);

            R = mat4.create();
            mat4.rotateZ(R, R, -135.1);

            mat4.multiply(this.textMatrix, this.textMatrix, R);
            mat4.multiply(this.textMatrix, this.textMatrix, T);
            mat4.multiply(this.textMatrix, this.textMatrix, S);
            

        } else {

            // Button Matrix

            this.matrix = mat4.create();
            
            var T = mat4.create();
            var auxT = vec3.fromValues(0.4, 0.6, -0.29);
            mat4.translate(T, T, auxT);

            var R = mat4.create();
            mat4.rotateX(R, R, -90);

            var S = mat4.create();
            var auxS = vec3.fromValues(0.5, 0.7, 1);
            mat4.scale(S, S, auxS);

            mat4.multiply(this.matrix, this.matrix, T);
            mat4.multiply(this.matrix, this.matrix, R);
            mat4.multiply(this.matrix, this.matrix, S);

            // Text Matrix

            this.textMatrix = mat4.create();
            
            T = mat4.create();
            auxT = vec3.fromValues(0.05, -0.35, 0.2);
            mat4.translate(T, T, auxT);

            S = mat4.create();
            auxS = vec3.fromValues(0.1, 0.07, 0.1);
            mat4.scale(S, S, auxS);

            mat4.multiply(this.textMatrix, this.textMatrix, T);
            mat4.multiply(this.textMatrix, this.textMatrix, S);
        }        
    }

    display() {
        this.scene.registerForPick(16+parseInt(this.player), this);

        var material = new CGFappearance(this.scene);
        material.setTexture(this.texture);
        material.apply();

        this.scene.pushMatrix();
        this.scene.multMatrix(this.matrix);

        this.scene.pushMatrix();
        this.scene.multMatrix(this.baseMatrix);
        this.base.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.multMatrix(this.textMatrix);
        this.text.display();
        this.scene.popMatrix();
        
        this.scene.popMatrix();
    }

    getPlayer() {
        return parseInt(this.player);
    }


}