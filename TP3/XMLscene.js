/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(MyInterface) {
        super();

        this.interface = MyInterface;

        this.swack = new Swack(this);

        // Variable to use with gui in order to be able to select the camera
        this.selectedCamera = "Ambient"; 

        this.difficulty = "Normal";
        this.modeP1 = "Human";
        this.modeP2 = "Human";
        
        // List of cameras loaded by XML (or the default ones if not defined in XML)
        this.cameraList = [];
        this.cameras = []; 

        this.name = "Room";

        this.currentScene = "Garage";
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.initCameras();

        this.enableTextures(true);

        //Background color
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
        
        this.loadingProgressObject=new MyRectangle(this, -1, -.1, 1, .1, 1, 1);
        this.loadingProgress=0;

        this.defaultAppearance = new CGFappearance(this);

        this.displayAxis = false;

        this.displayLights = false;

        this.first= true;
        this.first2 = false;
        this.initTime = 0;
        this.change = false;

        this.material = new CGFappearance(this);
        this.material.setAmbient(0, 0, 0, 1);
        this.material.setDiffuse(0, 0, 0, 1);
        this.material.setSpecular(0, 0, 0, 1);
        this.material.setShininess(1.0);
        
        this.second = false;
        this.firstId = 0;
        this.secondId = 0;

        this.movingPiece = false;
        this.movingPieceFirst = false;

        this.movements = [];

        this.cameraRotating = false;
        this.angle = 2*Math.PI;
        this.previous = "Ambient";

        this.success = "1";

        this.passButtons = [];

        this.start = false;
        this.automated = "none";

        this.computerMove = "";

        this.gameover = false;

        this.waiting = false;

        this.p1 = 0;
        this.p2 = 0;

        this.firstMovie = true;
    }

    undo(scene) {
        var move = this.movements.pop();
        var firstid = move[0];
        var secondid = move[1];
        this.graph.nodes[secondid.toString()][6].pop();
        this.numPieces[secondid]--; 
        var size = this.graph.nodes[firstid.toString()][6].length;
        var piece = this.graph.nodes[firstid.toString()][6][size-1];
        piece.colorChange();
        this.swack.changePlayer();

        var Lin = this.swack.getPosX(firstid); 
        var Col = this.swack.getPosY(firstid); 
        var FLin = this.swack.getPosX(secondid); 
        var FCol = this.swack.getPosY(secondid);
        this.swack.undoBoard(Col, Lin, FCol, FLin);

    }

    movedPiece(firstId, secondId) {
        var piece = this.graph.nodes[firstId.toString()][6].pop();
        piece.changePosition(secondId);
        piece.selected = false;
        piece.changeColor();
        var size = this.graph.nodes[this.secondId.toString()][6].length;
        var selectedPiece = this.graph.nodes[this.secondId.toString()][6][size-1];
        selectedPiece.selected = false;
        selectedPiece.changeColor();
        this.graph.nodes[secondId.toString()][6].push(piece);
        if (piece.getColor() == "redpiece") var newPiece = new GamePiece(this, firstId, "whitepiece");
        else var newPiece = new GamePiece(this, firstId, "redpiece");
        
        this.numPieces[secondId] = this.numPieces[secondId] + 1;
        newPiece.changeZ();
        this.graph.nodes[firstId.toString()][6].push(newPiece);

        this.setPickEnabled(true);
        this.movingPiece = false;
        
        setTimeout(this.resetWaiting.bind(this), 1000);
    }

    movedPieceMovie(firstId, secondId) {
        var piece = this.graph.nodes[firstId.toString()][6].pop();
        piece.changePosition(secondId);
        this.graph.nodes[secondId.toString()][6].push(piece);
        if (piece.getColor() == "redpiece") {
            var newP = new GamePiece(this, firstId, "whitepiece");
            this.graph.nodes["whitePiece_1"][4].pop();
        } else {
            var newP = new GamePiece(this, firstId, "redpiece");
            this.graph.nodes["redPiece_1"][4].pop();
        }
        
        this.numPieces[secondId] = this.numPieces[secondId] + 1;
        newP.changeZ();
        this.graph.nodes[firstId.toString()][6].push(newP);

        this.movingPiece = false;
        this.playingMovie = false;
        this.movie(this);
        
    }

    resetWaiting(scene) {
        this.waiting = false;
        if (this.automated == "none") {
            this.selectedCamera = this.previous == "Player 1" ? "Player 2" : "Player 1";
            this.onSelectedCameraChanged(this);
        }
    }

    movePiece(scene) {
        if (this.swack.success == "0") {
            var Piece = this.swack.getPlayer() + 1;
            var New = Piece == 1 ? 2 : 1;
            this.swack.changeBoard(this.Col, this.Lin, this.FCol, this.FLin, Piece, New);
            this.swack.changePlayer();
        
            this.setPickEnabled(false);
            this.movingPiece = true;
            this.movingPieceFirst = true;
            var size = this.graph.nodes[this.firstId.toString()][6].length;
            this.pieceMoved = this.graph.nodes[this.firstId.toString()][6][size-1];
            this.pieceMoved.getFinalPos(this.secondId);

            if (this.pieceMoved.getColor() == "redpiece") {
                this.newPiece = new GamePiece(this, this.firstId, "whitepiece");
                this.graph.nodes["whitePiece_1"][4].push(this.newPiece);
            } else {
                this.newPiece = new GamePiece(this, this.firstId, "redpiece");
                this.graph.nodes["redPiece_1"][4].push(this.newPiece);
            }
            this.newPiece.getFinal(this.secondId);

            var move = [this.firstId, this.secondId];
            this.movements.push(move);
        } else {
            window.alert('INVALID MOVE');
            this.waiting = false;
            var size = this.graph.nodes[this.firstId.toString()][6].length;
            var selectedPiece = this.graph.nodes[this.firstId.toString()][6][size-1];
            selectedPiece.selected = false;
            selectedPiece.changeColor();
            size = this.graph.nodes[this.secondId.toString()][6].length;
            selectedPiece = this.graph.nodes[this.secondId.toString()][6][size-1];
            selectedPiece.selected = false;
            selectedPiece.changeColor();
        }  
    }

    sendRequest() {
        this.Lin = this.swack.getPosX(this.firstId); 
        this.Col = this.swack.getPosY(this.firstId); 
        this.FLin = this.swack.getPosX(this.secondId); 
        this.FCol = this.swack.getPosY(this.secondId);

        var checkMove = 'checkMove(' +
                        this.swack.getBoard() + ',' + 
                        this.swack.getPlayer() + ',' + 
                        this.Col + ',' + 
                        this.Lin + ',' + 
                        this.FCol + ',' + 
                        this.FLin + ')';
        
        var swack = this.swack;

        this.swack.sendRequest(checkMove, function(data) {swack.success = data.target.response;});

        setTimeout(this.movePiece.bind(this), 1000);
    }

    gameOver() {
        this.gameover = true;

        var getWinner = 'get_Winner(' + this.swack.getBoard() + ',' + this.swack.currPlayer + ')';
        
        var swack = this.swack;

        this.swack.sendRequest(getWinner, function(data) {swack.winner = data.target.response; window.alert('THE WINNER IS PLAYER ' + data.target.response)});
        
        this.start = false;

        this.firstMovie = true;

        setTimeout(this.reset.bind(this), 5000);
    }

    reset(scene) {
        if (this.swack.winner == "1") {
            this.p1++;
        } else {
            this.p2++;
        }
        var newText = "P1 " + this.p1.toString() + " - " + this.p2.toString() + " P2";
        this.graph.nodes["points"][4][0].changeText(newText);
        this.swack.reset();
        this.swack = new Swack(this);
        this.gameover = false;
        this.selectedCamera = "Scorer";
        this.previous = "Ambient";
        this.onSelectedCameraChanged(this);
    }

    getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    automatedMove(scene) {
        console.log("MOVE " + this.computerMove);
        this.swack.success = "0";
        var move = [];
        for (var i = 0; i < this.computerMove.length; i++) {
            if (this.computerMove[i] != '[' && this.computerMove[i] != ',' && this.computerMove[i] != ']') {
                move.push(parseInt(this.computerMove[i]));
            }
        }
        this.Col = move[1];
        this.Lin = move[0];
        this.FCol = move[3];
        this.FLin = move[2];
        this.firstId = this.swack.getId(this.Lin, this.Col);
        this.secondId = this.swack.getId(this.FLin, this.FCol);
        this.movePiece(this);
    }

    automatedPlay() {
        if (this.start && !this.waiting) {
            // Play or pass?
            var pp = this.getRandomIntInclusive(0, 1);

            if (pp == 0) { // Pass
                window.alert("COMPUTER PASSED");
                this.swack.changePlayer();
                this.swack.passed();
                if (this.swack.getPass() >= 2) {
                    this.setPickEnabled(false);
                    this.gameOver();
                }
            } else if (!this.gameover) { // Play
                window.alert("COMPUTER IS GOING TO PLAY. PLEASE WAIT WHILE IT CHOOSES A MOVE.");
                this.waiting = true;
                if (this.difficulty == "Normal") {
                    var diff = "1";
                    var timeout = 5000;
                } else {
                    var diff = "2";
                    var timeout = 20000;
                }

                var message = 'getMove(' +
                            this.swack.currPlayer + ',' +
                            this.swack.getBoard() + ',' +
                            diff + ')';

                this.previousAut = this.automated;
                this.automated = "waiting";
                var scene = this;            

                this.swack.sendRequest(message, function(data) {scene.automated = scene.previousAut; scene.computerMove = data.target.responseText});

                setTimeout(this.automatedMove.bind(this), timeout);
            }  
        }
    }

    logPicking() {
		if (this.pickMode == false) {
            if (this.pickResults != null && this.pickResults.length > 0) {
				for (var i = 0; i < this.pickResults.length; i++) {
                    var obj = this.pickResults[i][0];
					if (obj) {
                        var customId = this.pickResults[i][1];
                        if (obj instanceof PassButton) {
                            if (this.passButtons[customId-16].getPlayer() == (this.swack.getPlayer() + 1)) {
                                this.swack.changePlayer();
                                this.swack.passed();
                                if (this.swack.getPass() >= 2) {
                                    this.setPickEnabled(false);
                                    this.gameOver();
                                } else {
                                    if (this.automated == "none") {
                                        this.selectedCamera = this.previous == "Player 1" ? "Player 2" : "Player 1";
                                        this.onSelectedCameraChanged(this);
                                    }
                                }
                            }
                        } else {
                            if (this.second) {
                                this.secondId = customId;
                                var size = this.graph.nodes[this.secondId.toString()][6].length;
                                var selectedPiece = this.graph.nodes[this.secondId.toString()][6][size-1];
                                selectedPiece.selected = true;
                                selectedPiece.changeColor();
                                this.waiting = true;
                                this.sendRequest();
                                this.second = false;
                            } else {
                                this.second = true;
                                this.firstId = customId;
                                var size = this.graph.nodes[this.firstId.toString()][6].length;
                                var selectedPiece = this.graph.nodes[this.firstId.toString()][6][size-1];
                                selectedPiece.selected = true;
                                selectedPiece.changeColor();
                            }
                        }				
					}
				}
				this.pickResults.splice(0, this.pickResults.length);
			}
		}
    }
    
    changing(scene) {
        this.graph = this.currentScene == "Room" ? this.roomGraph : this.garageGraph;
        this.clearLights();
        this.initLights();
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
    }

    clearLights() {
        this.interface.gui.removeFolder(this.lights_folder);
        this.lights_folder = this.interface.gui.addFolder('Lights');
    }

    startgame(scene) {
        if (this.start == false) {

            this.firstMove = true;
            this.changedPlayer = true;
            
            this.movements = [];
            this.numPieces = [0, 1, 1, 1, 1,
                1, 1, 1, 1,
                1, 1, 1, 1,
                1, 1, 1, 1];

            console.log(this.swack.getBoard());
            console.log(this.numPieces);

            // enable picking
            this.setPickEnabled(true);
            this.start = true;
            if (this.modeP1 == "Computer" && this.modeP2 == "Computer") {
                this.automated = "both";
                this.selectedCamera = "Board";
                this.onSelectedCameraChanged(this);
            } else if (this.modeP1 == "Computer" && this.modeP2 == "Human") {
                this.automated = "p1";
                this.selectedCamera = "Player 2";
                this.onSelectedCameraChanged(this);
            } else if (this.modeP1 == "Human" && this.modeP2 == "Computer") {
                this.automated = "p2";
                this.selectedCamera = "Player 1";
                this.onSelectedCameraChanged(this);
            } else {
                this.automated = "none";
                this.selectedCamera = "Player 1";
                this.onSelectedCameraChanged(this);
                this.selectedCamera = "Player 2";
                this.onSelectedCameraChanged(this);
            }            
        }        
    }

    endgame(scene) {
        if (this.start == true) {
            this.start = false;
            this.swack.reset();
            this.swack = new Swack(this);
            // disable picking
            this.setPickEnabled(false);
            this.selectedCamera = "Scorer";
            this.previous = "Ambient";
            this.onSelectedCameraChanged(this);
        }
    }

    initSceneChange() {
        var scene_folder = this.interface.gui.addFolder('Scene');
        scene_folder.open();

        scene_folder.add(this, 'currentScene', ["Room", "Garage"]).onChange(this.changing.bind(this)).name('Scene');

        // Lights folder in GUI
        this.lights_folder = this.interface.gui.addFolder('Lights');

        let undo = { undo: this.undo.bind(this) };
        this.interface.game_folder.add(undo, 'undo').name('Undo');

        let start = { start: this.startgame.bind(this)};
        let end = { end: this.endgame.bind(this)};

        this.interface.game_folder.add(start, 'start').name('Start Game');
        this.interface.game_folder.add(end, 'end').name('Reset Game');

        let movie = { movie: this.movie.bind(this) };
        this.interface.game_folder.add(movie, 'movie').name('Game Movie');
    }

    movie(scene) {
        if (this.firstMovie) {
            this.numPieces = [0, 1, 1, 1, 1,
                1, 1, 1, 1,
                1, 1, 1, 1,
                1, 1, 1, 1];
            this.firstMovie = false;
        }
        if (this.movements.length == 0) {
            console.log("THERE'S NOT AN AVAILABLE GAME TO SHOW.");
        } else {
            this.setPickEnabled(false);
            this.playingMovie = true;
            this.movingPiece = false;
            var move = this.movements.shift();
            this.movingPiece = true;
            this.movingPieceFirst = true;
            this.firstId = move[0];
            this.secondId = move[1];
            var size = this.graph.nodes[this.firstId.toString()][6].length;
            this.pieceMoved = this.graph.nodes[this.firstId.toString()][6][size-1];
            this.pieceMoved.getFinalPos(this.secondId);
        }
    } 
    
    
    
    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        // Lights index.
        var i = 0;

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebCGF on default shaders.

            if (this.graph.lights.hasOwnProperty(key)) {
                var graphLight = this.graph.lights[key];

                // Creation and enable/disable of the lights according to value defined in xml
                var type = 'bool_lights_' + i;
                this[type] = graphLight[0] === 1 ? false : true;

                this.lights[i].setPosition(...graphLight[1]);
                this.lights[i].setAmbient(...graphLight[2]);
                this.lights[i].setDiffuse(...graphLight[3]);
                this.lights[i].setSpecular(...graphLight[4]);

                this.lights[i].setVisible(true);
                if (this[type])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
  
                // add light to gui lights folder
                this.lights_folder.add(this, type).name(key);
                this.lights_folder.open();

            }
        }
    }

    /** Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        this.axis = new CGFaxis(this, this.graph.referenceLength);

        this.gl.clearColor(...this.graph.background);

        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        
        this.gl.enable(this.gl.BLEND);

        this.setGlobalAmbientLight(...this.graph.ambient);

        this.initSceneChange();
        
        this.initLights();

        this.sceneInited = true;

        this.setUpdatePeriod(100);
    }

    update(time) {
        if (this.first) {
            this.first= false;
            this.initTime = time;
        }
        var realTime = (time-this.initTime) / 1000;
        this.graph.updateAnimation(realTime);

        if (this.movingPiece) {
            if (this.movingPieceFirst) {
                this.initMoving = time;
                this.movingPieceFirst = false;
            }
            var realMovingTime = (time-this.initMoving) / 1000;
            if (!this.pieceMoved.update(realMovingTime)) {
                if (this.playingMovie) { 
                    this.movedPieceMovie(this.firstId, this.secondId);
                }
                else this.movedPiece(this.firstId, this.secondId);
            }
            this.newPiece.update(realMovingTime);
        }

        if (this.cameraRotating) {
            this.currentAngle = 0.7;
        }
        this.moveCamera();
        
        if (this.start) {
            if (this.firstMove) {
                this.firstMove = false;
                this.initTimeGame = time;
            }
            var realGameTime = (time-this.initTimeGame) / 1000;
            var realGameTime = realGameTime.toFixed(0);
            if (realGameTime < 60) {
                var seconds = realGameTime;
                this.graph.nodes["gametime"][4][0].changeText("Time 00m" + seconds + "s");
            } else {
                var minutes = (realGameTime / 60).toFixed(0);
                var seconds = realGameTime - (60*minutes);
                this.graph.nodes["gametime"][4][0].changeText("Time " + minutes + "m" + seconds + "s");
            }

            if (this.changedPlayer) {
                this.timeP2 = 0;
                this.timeP1 = 0;
                this.initialTime = time;
                this.changedPlayer = false;
            }
            if (this.swack.currPlayer == 0) {
                this.timeP1 = (time-this.initialTime) / 1000;
                this.timeP1 = this.timeP1.toFixed(0);
                this.graph.nodes["text2"][4][0].changeText("TIME " + this.timeP1 + "s");
                this.graph.nodes["text1"][4][0].changeText("TIME " + this.timeP2 + "s");
            } else {
                this.timeP2 = (time-this.initialTime) / 1000;
                this.timeP2 = this.timeP2.toFixed(0);
                this.graph.nodes["text1"][4][0].changeText("TIME " + this.timeP2 + "s");
                this.graph.nodes["text2"][4][0].changeText("TIME " + this.timeP1 + "s");
            }
            if (this.timeP1 > 30 || this.timeP2 > 30) {
                this.swack.changePlayer();
                this.swack.passed();
                if (this.swack.getPass() >= 2) {
                    this.setPickEnabled(false);
                    this.gameOver();
                } else {
                    if (this.automated == "none") {
                        this.selectedCamera = this.previous == "Player 1" ? "Player 2" : "Player 1";
                        this.onSelectedCameraChanged(this);
                    }
                }
            }

        }
        
    }

    moveCamera() {
        if (this.cameraRotating) {
            if (this.angle < 0) {
                this.cameraRotating = false;
                this.angle = 2*Math.PI;
                if (this.camera == this.cameras["Player 1"]) {
                    this.previous = "Player 2";
                    this.interface.setActiveCamera(this.cameras["Player 2"]);
                } else {
                    this.previous = "Player 1";
                    this.interface.setActiveCamera(this.cameras["Player 1"]);
                } 
            } else {
                this.angle -= this.currentAngle;
                this.camera.orbit(vec3.fromValues(1, 0, 0), this.currentAngle);
            }   
        }
    }

    // function to change the camera when the dropbox in gui is changed
    onSelectedCameraChanged(v) {
        if (this.previous == "Player 1" && this.selectedCamera == "Player 2") {
            this.cameraRotating = true;
            this.camera = this.cameras["Player 1"];
        } else if (this.previous == "Player 2" && this.selectedCamera == "Player 1") {
            this.cameraRotating = true;
            this.camera = this.cameras["Player 2"];
        } else {
            if (this.selectedCamera == "Player 1") this.previous = "Player 1";
            else if (this.selectedCamera == "Player 2") this.previous = "Player 2";
            this.camera = this.cameras[this.selectedCamera];
            this.interface.setActiveCamera(this.camera);
        }
        
    }

    updateLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebCGF on default shaders.

            if (this.graph.lights.hasOwnProperty(key)) {
                
                var type = 'bool_lights_' + i;

                if (this[type]) {
                    if (this.displayLights)
                        this.lights[i].setVisible(true);
                    else {
                        this.lights[i].setVisible(false);
                    }
                    this.lights[i].enable();
                }
                else {
                    this.lights[i].setVisible(false);
                    this.lights[i].disable();
                }
                    

                this.lights[i].update();

                i++;
  
            }
        }
    }

    /**
     * Displays the scene.
     */
    display() {
        switch(this.automated) {
            case 'none':
                this.logPicking();
		        this.clearPickRegistration();
                break;
            case 'both':
                this.automatedPlay();
                break;
            case 'p1':
                if (this.swack.currPlayer != 0) {
                    this.logPicking();
		            this.clearPickRegistration();
                } else this.automatedPlay();
                break;
            case 'p2':
                if (this.swack.currPlayer != 1) {
                    this.logPicking();
		            this.clearPickRegistration();
                } else this.automatedPlay();
                break;
            case 'waiting':
                console.log("Waiting for answer");
                break;
            default:
                break;
        }
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();

        // Draw axis
        if (this.displayAxis)
            this.axis.display();

        this.updateLights();

        for (var i = 0; i < this.lights.length; i++) {
            this.lights[i].setVisible(true);
            this.lights[i].enable();
        }

        if (this.sceneInited) {
            this.defaultAppearance.apply();

            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();

        }
        else
        {
            // Show some "loading" visuals
            this.defaultAppearance.apply();

            this.rotate(-this.loadingProgress/10.0,0,0,1);
            
            this.loadingProgressObject.display();
            this.loadingProgress++;
        }

        this.popMatrix();

        // ---- END Background, camera and axis setup
    }
}