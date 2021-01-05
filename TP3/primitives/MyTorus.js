/**
 * MyTorus
 * @constructor
 * @param scene - Reference to MyScene object
 * @param innerRad - Inner radius
 * @param outerRad - Outer radius
 * @param loops - Number of loops
 * @param slices - Number of slices
 */
class MyTorus extends CGFobject {

    constructor(scene, innerRad, outerRad, slices, loops) {
        super(scene);
        this.innerRad = innerRad;
        this.outerRad = outerRad;
        this.loops = loops;
        this.slices = slices;

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.normals = [];
        this.indices = [];
        this.texCoords = [];

        var vertexX, vertexY, vertexZ;
        var normX, normY, normZ;

        for (var slice = 0; slice <= this.slices; slice++) {
            for (var loop = 0; loop <= this.loops; loop++) {

                vertexX = (this.outerRad + this.innerRad * Math.cos((slice / this.slices) * Math.PI * 2)) * Math.cos((loop / this.loops) * Math.PI * 2);
                vertexY = (this.outerRad + this.innerRad * Math.cos((slice / this.slices) * Math.PI * 2)) * Math.sin((loop / this.loops) * Math.PI * 2);
                vertexZ = this.innerRad * Math.sin((slice / this.slices) * Math.PI * 2);

                this.vertices.push(vertexX, vertexY, vertexZ);

                normX = vertexX - (this.outerRad * Math.cos((loop / this.loops) * Math.PI * 2));
                normY = vertexY - (this.outerRad * Math.sin((loop / this.loops) * Math.PI * 2));
                normZ = vertexZ;

                this.normals.push(normX, normY, normZ);
                this.texCoords.push(slice / this.slices, loop / this.loops);
            }
        }


        for (var i = 0; i < this.slices; i++) {
            for (var j = 0; j < this.loops; j++) {

                this.indices.push((this.loops + 1) * (i + 1) + j, (this.loops + 1) * i + j, (this.loops + 1) * (i + 1) + (j + 1));
                this.indices.push((this.loops + 1) * i + j, (this.loops + 1) * i + (j + 1), (this.loops + 1) * (i + 1) + (j + 1));

            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

}