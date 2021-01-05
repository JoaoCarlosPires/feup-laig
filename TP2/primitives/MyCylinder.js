/**
 * MyCylinder
 * @constructor
 */

class MyCylinder extends CGFobject {
    constructor(scene, base, top, height, stacks, slices) {
        super(scene);
        this.base = base;
        this.top = top;
        this.height = height;
        this.stacks = stacks;
        this.slices = slices;

        this.initBuffers();
    }

    initBuffers() {

        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var vertexX, vertexY, vertexZ;

        for (var stack = 0; stack <= this.stacks; stack++) {

            // Difference between top and base's radius for each stack
            var rad = (stack / this.stacks) * (this.base - this.top) + this.top;

            for (var slice = 0; slice <= this.slices; slice++) {

                // Angle difference between each vertex
                var angle = (slice / this.slices) * Math.PI * 2;

                vertexX = rad * Math.cos(angle);
                vertexY = rad * Math.sin(angle);
                vertexZ = (1 - (stack / this.stacks)) * this.height;

                this.vertices.push(vertexX, vertexY, vertexZ);

                this.normals.push(Math.cos(angle), Math.sin(angle), (this.base - this.top) / this.height);
                this.texCoords.push(slice / this.slices, stack / this.stacks);
            }
        }

        for (var i = 0; i < this.slices; i++) {
            for (var j = 0; j < this.stacks; j++) {

                this.indices.push((j * (this.slices + 1) + i), ((j + 1) * (this.slices + 1) + i), (j * (this.slices + 1) + i + 1));
                this.indices.push(((j + 1) * (this.slices + 1) + i), ((j + 1) * (this.slices + 1) + i + 1), (j * (this.slices + 1) + i + 1));
            }

        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}