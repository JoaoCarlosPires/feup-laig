/**
 * MySpriteSheet
 * @constructor
 */

class MySpriteSheet {

    constructor(scene, texture, sizeM, sizeN) {
        this.scene = scene;
        
        this.texture = new CGFtexture(this.scene, texture);
        
        this.sizeM = sizeM;
        this.sizeN = sizeN;
        
        this.shader = new CGFshader(this.scene.gl, "shaders/shader.vert", "shaders/shader.frag");
    }

    activateCellMN(m, n) {
        this.scene.material.setTexture(this.texture);
        this.scene.material.apply();
        this.texture.bind();
        this.scene.setActiveShaderSimple(this.shader);
        this.shader.setUniformsValues({ M: m, N: n, sizeM: this.sizeM, sizeN: this.sizeN });
    }

    activateCellP(p) {
        var n = Math.floor(p / this.sizeM);
        var m = Math.floor(p % this.sizeM);
        this.activateCellMN(m, n);
    }
}
