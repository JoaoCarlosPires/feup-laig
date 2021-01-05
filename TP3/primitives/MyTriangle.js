/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param x1 - x coordinate corner 1
 * @param y1 - y coordinate corner 1
 * @param z1 - z coordinate corner 1
 * @param x2 - x coordinate corner 2
 * @param y2 - y coordinate corner 2
 * @param z2 - z coordinate corner 2
 * @param x3 - x coordinate corner 3
 * @param y3 - y coordinate corner 3
 * @param z3 - z coordinate corner 3
 *
 */

class MyTriangle extends CGFobject {
    constructor(scene, x1, x2, x3, y1, y2, y3, z1, z2, z3, afs, aft) {
        super(scene);
        this.x1 = x1;
        this.x2 = x2;
        this.x3 = x3;
        this.y1 = y1;
        this.y2 = y2;
        this.y3 = y3;
        this.z1 = z1;
        this.z2 = z2;
        this.z3 = z3;
        this.aft = aft;
		this.afs = afs;

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [
            this.x1, this.y1, this.z1, //0
            this.x2, this.y2, this.z2, //1
            this.x3, this.y3, this.z3, //2

            this.x1, this.y1, this.z1, //0
            this.x2, this.y2, this.z2, //1
            this.x3, this.y3, this.z3, //2
        ];

        //Counter-clockwise reference of vertices
        this.indices = [
            0, 1, 2,
            3, 5, 4
        ];

        //Facing Z positive
        this.normals = [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, -1,
			0, 0, -1,
			0, 0, -1
        ];

        /*
        Texture coords (s,t)
        +----------> s
        |
        |
        |
        v
        t
        */

        this.texCoords = [
            ((this.dist(this.x1, this.x3, this.y1, this.y3)*this.cos()) / this.afs), ((this.dist(this.x1, this.x3, this.y1, this.y3)*this.sin()) / this.aft),
			(this.dist(this.x1, this.x2, this.y1, this.y2) / this.afs), 0,
			0, 0
        ]
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    dist(x1, x2, y1, y2) {
        return Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
    }

    cos() {
        var a = this.dist(this.x1, this.x2, this.y1, this.y2);
        var b = this.dist(this.x2, this.x3, this.y2, this.y3);
        var c = this.dist(this.x1, this.x3, this.y1, this.y3);
        return (a*a - b*b + c*c)/(2*a*c);
    }

    sin() {
        return Math.sqrt(1 - (this.cos()*this.cos()));
    }

    /**
     * @method updateTexCoords
     * Updates the list of texture coordinates of the rectangle
     * @param {Array} coords - Array of texture coordinates
     */
    updateTexCoords(coords) {
        this.texCoords = [...coords];
        this.updateTexCoordsGLBuffers();
    }
}