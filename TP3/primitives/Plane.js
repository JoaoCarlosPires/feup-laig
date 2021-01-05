/**
 * Plane
 * @constructor
 */

class Plane extends CGFobject {
    constructor(scene, divU, divV, aft, afs) {
        super(scene);

        this.divU = divU;
        this.divV = divV;

        this.aft = 1 / aft;
		this.afs = 1 / afs;

        this.numVert = (divV+2) * (divU+2);

        this.initBuffers();
    }

    initBuffers() {

        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var x_div = 1 / (this.divU+1);
        var z_div = 1 / (this.divV+1);

        var start_x = -0.5;

        for (var i = 0; i <= this.divU+1; i++) {
            var start_z = -0.5;
            for (var k = 0; k <= this.divV+1; k++) {
                this.vertices.push(start_x, 0, start_z);
                this.normals.push(0, 1, 0);
                this.texCoords.push(this.aft*start_z, this.afs*start_x)
                start_z+=z_div;
            }    
            start_x+=x_div;
        }

        for(var l = 0; l<(this.numVert/2); l++) {
            this.indices.push(l, l+1, l+this.divU+2); 
            this.indices.push(l+this.divU+2, l+1, l+this.divU+3); 
        }
        
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
    }

}