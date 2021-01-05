/**
 * Patch
 * @constructor
 */

class Patch extends CGFobject {
    constructor(scene, npointsU, npointsV, npartsU, npartsV, controlVertexes) {
        super(scene);

        console.log(npointsU);
        this.npointsU = npointsU;
        this.npointsV = npointsV;

        this.npartsU = npartsU;
        this.npartsV = npartsV;

        this.controlVertexes = controlVertexes;

        this.nurbsSurface = new CGFnurbsSurface(this.npartsU, this.npartsV, this.controlVertexes);
        this.surface = new CGFnurbsObject(scene, 20, 20, this.nurbsSurface);   
    }

    display() {
      this.surface.display();
    }

}