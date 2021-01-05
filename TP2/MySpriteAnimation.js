/**
 * MySpriteAnimation
 * @constructor
 */

class MySpriteAnimation {
    constructor(scene, sprite, begin, end, duration) {
        this.scene = scene;

        this.sprite = sprite;

        this.begin = begin;
        this.end = end;
        
        this.duration = duration;

        this.timePerCell = this.duration / ((this.end-this.begin) + 1) ;

        this.times = [];
        this.times.push(0);
        for (var i = 0; i < ((this.end-this.begin) + 1); i++) {
            this.times.push(this.timePerCell * (i+1));
        }

        this.previous = 0;
        this.current = 0;

        this.aux = 0;

        this.rectangle = new MyRectangle(this.scene, 0, 0, 1, 1, 1.0, 1.0);
    }

    update(time) {
        var deltaT = time - this.previous;
        this.previous = time;
        if (this.current + deltaT >= this.duration) {
            this.current = 0;
        } else {
            this.current += deltaT;
        }
         
        for (var t = 1; t < this.times.length; t++) {
            if ((this.current > this.times[t-1]) && (this.current < this.times[t])) {
                this.aux = this.begin + (t-1);
            }
        }
    }

    display() {
        this.sprite.activateCellP(this.aux);
        this.rectangle.display();  
        this.scene.setActiveShaderSimple(this.scene.defaultShader);
    }

}