/**
 * KeyframeAnimation
 * @constructor
 */

class KeyframeAnimation extends Animation {
    constructor(scene, keyframesVector) {
        super();
        this.scene = scene;
        this.iinicial = [];
        this.ifinal = [];
        this.tinicial = [];
        this.tfinal = [];

        this.numAnimations = (keyframesVector.length)/4;

        var index = 0;

        for (var i = 0; i < this.numAnimations; i++) {
            this.iinicial.push(keyframesVector[index]);
            this.ifinal.push(keyframesVector[++index]);
            this.tinicial.push(keyframesVector[++index]);
            this.tfinal.push(keyframesVector[++index]);
            index++;
        }

        this.tatual = mat4.create();
        
        this.translate = vec3.create();
        this.translateM = mat4.create();

        this.angleX = 0;
        this.rotateX = mat4.create();
        
        this.angleY = 0;
        this.rotateY = mat4.create();
        
        this.angleZ = 0;
        this.rotateZ = mat4.create();
        
        this.scale = vec3.create();
        this.scaleM = mat4.create();

        this.deltaT = 0;

/*
    tinicial    tfinal      iinicial    ifinal      índice
    
    m0          m1          i0          i1          0
    m1          m2          i1          i2          1
    m2          m3          i2          i3          2
    ...         ...         ...         ...
*/
    }

    // Atualização dos valores de transformação
    update(instante) {
        // if the animation reached the end
        if (instante > this.ifinal[this.ifinal.length-1]) {
            return ;
        }

        this.tatual = mat4.create();

        // if the animation didn't start, multiply for empty matrix
        if (instante < this.iinicial[0]) {
            var vecA = vec3.fromValues(0, 0, 0);
            mat4.multiply(this.tatual, this.tatual, vecA);
            return ;
        }

        this.translate = vec3.create();
        this.translateM = mat4.create();

        this.angleX = 0;
        this.rotateX = mat4.create();
        
        this.angleY = 0;
        this.rotateY = mat4.create();
        
        this.angleZ = 0;
        this.rotateZ = mat4.create();

        this.scale = vec3.create();
        this.scaleM = mat4.create();

        for (var i = 0; i < this.iinicial.length; i++) {
            if (instante > this.iinicial[i] && instante < this.ifinal[i]) {
                this.deltaT = (instante-this.iinicial[i])/(this.ifinal[i]-this.iinicial[i]);

                vec3.subtract(this.translate, this.tfinal[i][0], this.tinicial[i][0]);
                vec3.multiply(this.translate, this.translate, vec3.fromValues(this.deltaT, this.deltaT, this.deltaT));
                vec3.add(this.translate, this.translate, this.tinicial[i][0]);
                mat4.translate(this.translateM, this.translateM, this.translate);

                this.angleX = this.tfinal[i][1] - this.tinicial[i][1];
                this.angleX = this.tinicial[i][1] + (this.angleX*this.deltaT); 
                mat4.rotateX(this.rotateX, this.rotateX, this.angleX);
                
                this.angleY = this.tfinal[i][2] - this.tinicial[i][2];
                this.angleY = this.tinicial[i][2] + (this.angleY*this.deltaT); 
                mat4.rotateY(this.rotateY, this.rotateY, this.angleY);
                
                this.angleZ = this.tfinal[i][3] - this.tinicial[i][3];
                this.angleZ = this.tinicial[i][3] + (this.angleZ*this.deltaT); 
                mat4.rotateZ(this.rotateZ, this.rotateZ, this.angleZ);
                
                vec3.subtract(this.scale, this.tfinal[i][4], this.tinicial[i][4]);
                vec3.multiply(this.scale, this.scale, vec3.fromValues(this.deltaT, this.deltaT, this.deltaT));
                vec3.add(this.scale, this.scale, this.tinicial[i][4]);
                mat4.scale(this.scaleM, this.scaleM, this.scale);

            }
        }

        // update de this.tatual
        mat4.multiply(this.tatual, this.tatual, this.translateM);
        mat4.multiply(this.tatual, this.tatual, this.rotateX);
        mat4.multiply(this.tatual, this.tatual, this.rotateY);
        mat4.multiply(this.tatual, this.tatual, this.rotateZ);
        mat4.multiply(this.tatual, this.tatual, this.scaleM);

    }

    // Aplica as alterações de transformação
    apply() {
        this.scene.multMatrix(this.tatual);
    }
}

