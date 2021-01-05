/**
 * defbarrel
 * @constructor
 */

class defbarrel extends CGFobject {
    constructor(scene, base, middle, height, slices, stacks) {
        super(scene);
        this.scene = scene;

        this.base = base; 
        this.middle = middle; 

        this.height = height; 

        this.slices = slices;
        this.stacks = stacks; 

        this.h = (4 / 3) * this.base;
        this.H = (4 / 3) * (this.middle - this.base);
        this.H2 = (4 / 3) * this.middle;

        this.controlPoints = [
            [
                [-this.base, 0.0, 0.0, 1],
                [-this.base, this.h, 0.0, 1],
                [this.base, this.h, 0.0, 1],
                [this.base, 0.0, 0.0, 1]
            ],
            [
                [-(this.base + this.H), 0.0, this.H / Math.tan(0.35), 1],
                [-(this.base + this.H), this.H2, this.H / Math.tan(0.35), 1],
                [this.base + this.H, this.H2, this.H / Math.tan(0.35), 1],
                [this.base + this.H, 0.0, this.H / Math.tan(0.35), 1]
            ],
            [
                [-(this.base + this.H), 0.0, this.height - (this.H / Math.tan(0.35)), 1],
                [-(this.base + this.H), this.H2, this.height - (this.H / Math.tan(0.35)), 1],
                [this.base + this.H, this.H2, this.height - (this.H / Math.tan(0.35)), 1],
                [this.base + this.H, 0.0, this.height - (this.H / Math.tan(0.35)), 1]
            ],
            [
                [-this.base, 0.0, this.height, 1],
                [-this.base, this.h, this.height, 1],
                [this.base, this.h, this.height, 1],
                [this.base, 0.0, this.height, 1]
            ],
        ];

        this.controlPoints2 = [
            [
                [this.base, 0.0, 0.0, 1],
                [this.base, -this.h, 0.0, 1],
                [-this.base, -this.h, 0.0, 1],
                [-this.base, 0.0, 0.0, 1],               
            ],
            [
                [this.base + this.H, 0.0, this.H / Math.tan(0.35), 1],
                [this.base + this.H, -this.H2, this.H / Math.tan(0.35), 1],
                [-(this.base + this.H), -this.H2, this.H / Math.tan(0.35), 1],
                [-(this.base + this.H), 0.0, this.H / Math.tan(0.35), 1],                
            ],
            [
                [this.base + this.H, 0.0, this.height - (this.H / Math.tan(0.35)), 1],
                [this.base + this.H, -this.H2, this.height - (this.H / Math.tan(0.35)), 1],
                [-(this.base + this.H), -this.H2, this.height - (this.H / Math.tan(0.35)), 1],
                [-(this.base + this.H), 0.0, this.height - (this.H / Math.tan(0.35)), 1]           
            ],
            [
                [this.base, 0.0, this.height, 1], 
                [this.base, -this.h, this.height, 1],
                [-this.base, -this.h, this.height, 1],
                [-this.base, 0.0, this.height, 1],
            ],
        ];

        var npointsU = this.slices+1;
        var npointsV = this.stacks+1;

        this.patch = new Patch(scene, npointsU.toString(), npointsV.toString(), this.slices, this.stacks, this.controlPoints);
        this.patch2 = new Patch(scene, npointsU.toString(), npointsV.toString(), this.slices, this.stacks, this.controlPoints2);
    }

    display() {
        this.patch.display();
        this.patch2.display();
    }
}