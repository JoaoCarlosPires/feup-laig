/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by defult)

        // gui checkbox to display axis
        this.gui.add(this.scene, 'displayAxis').name("Display axis");

        // gui checkbox to display lights (the tiny white cube). In other words, doesn't affect the light effect, just it's visual
        this.gui.add(this.scene, 'displayLights').name("Display light point");

        this.game_folder = this.gui.addFolder('Game');
        this.game_folder.add(this.scene, 'difficulty', ["Normal", "Hard"]).name('Difficulty');

        this.game_folder.add(this.scene, 'modeP1', ["Human", "Computer"]).name('Player 1');
        this.game_folder.add(this.scene, 'modeP2', ["Human", "Computer"]).name('Player 2');

        this.game_folder.open();

        this.initKeys();

        return true;
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui=this;
        this.processKeyboard=function(){};
        this.activeKeys={};
    }

    processKeyDown(event) {
        this.activeKeys[event.code]=true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code]=false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }
}