const DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var INITIALS_INDEX = 0;
var VIEWS_INDEX = 1;
var ILLUMINATION_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var SPRITESHEETS_INDEX = 5;
var MATERIALS_INDEX = 6;
var NODES_INDEX = 7;
var ANIMATIONS_INDEX = 7;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * Constructor for MySceneGraph class.
     * Initializes necessary variables and starts the XML file reading process.
     * @param {string} filename - File that defines the 3D scene
     * @param {XMLScene} scene
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null; // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Converts degrees to radians
     * @param {float} degrees 
     */
    degrees_to_radians(degrees) {
        var pi = Math.PI;
        return degrees * (pi / 180);
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lsf")
            return "root tag <lsf> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <initials>
        var index;
        if ((index = nodeNames.indexOf("initials")) == -1)
            return "tag <initials> missing";
        else {
            if (index != INITIALS_INDEX)
                this.onXMLMinorError("tag <initials> out of order " + index);

            //Parse initials block
            if ((error = this.parseInitials(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        // <illumination>
        if ((index = nodeNames.indexOf("illumination")) == -1)
            return "tag <illumination> missing";
        else {
            if (index != ILLUMINATION_INDEX)
                this.onXMLMinorError("tag <illumination> out of order");

            //Parse illumination block
            if ((error = this.parseIllumination(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }

        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <spritesheets>
        if ((index = nodeNames.indexOf("spritesheets")) == -1)
            return "tag <spritesheets> missing";
        else {
            if (index != SPRITESHEETS_INDEX)
                this.onXMLMinorError("tag <spritesheets> out of order");

            //Parse spritesheets block
            if ((error = this.parseSpritesheets(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <animations>
        if ((index = nodeNames.indexOf("animations")) == -1)
            this.log("tag <animations> missing");
        else {
            if (index != ANIMATIONS_INDEX)
                this.onXMLMinorError("tag <animations> out of order");
            else
                NODES_INDEX++;
            //Parse animations block
            if ((error = this.parseAnimations(nodes[index])) != null)
                return error;
        }

        // <nodes>
        if ((index = nodeNames.indexOf("nodes")) == -1)
            return "tag <nodes> missing";
        else {
            if (index != NODES_INDEX)
                this.onXMLMinorError("tag <nodes> out of order");

            //Parse nodes block
            if ((error = this.parseNodes(nodes[index])) != null)
                return error;
        }

        this.log("All parsed");
    }

    /**
     * Parses the <initials> block. 
     * @param {initials block element} initialsNode
     */
    parseInitials(initialsNode) {
        var children = initialsNode.children;
        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var rootIndex = nodeNames.indexOf("root");
        var referenceIndex = nodeNames.indexOf("reference");

        // Get root of the scene.
        if (rootIndex == -1)
            return "No root id defined for scene.";

        var rootNode = children[rootIndex];
        var id = this.reader.getString(rootNode, 'id');
        if (id == null)
            return "No root id defined for scene.";

        this.idRoot = id;

        // Get axis length        
        if (referenceIndex == -1)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        var refNode = children[referenceIndex];
        var axis_length = this.reader.getFloat(refNode, 'length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed initials");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseViews(viewsNode) {

        this.cameras = [];

        var idDefaultCamera = this.reader.getString(viewsNode, 'default');

        var children = viewsNode.children;

        var numCameras = 0;

        for (var i = 0; i < children.length; i++) {

            var grandChildren = children[i].children;

            var idCamera = this.reader.getString(children[i], 'id');
            var near = this.reader.getFloat(children[i], 'near');
            var far = this.reader.getFloat(children[i], 'far');

            var x = this.reader.getFloat(grandChildren[0], 'x');
            var y = this.reader.getFloat(grandChildren[0], 'y');
            var z = this.reader.getFloat(grandChildren[0], 'z');
            var from = vec3.fromValues(x, y, z);

            var x = this.reader.getFloat(grandChildren[1], 'x');
            var y = this.reader.getFloat(grandChildren[1], 'y');
            var z = this.reader.getFloat(grandChildren[1], 'z');
            var to = vec3.fromValues(x, y, z);

            switch (children[i].nodeName) {

                case 'perspective':

                    var angle = this.degrees_to_radians(this.reader.getFloat(children[i], 'angle'));

                    var camera = new CGFcamera(angle, near, far, from, to);

                    break;

                case 'ortho':

                    var left = this.reader.getFloat(children[i], 'left');
                    var right = this.reader.getFloat(children[i], 'right');
                    var top = this.reader.getFloat(children[i], 'top');
                    var bottom = this.reader.getFloat(children[i], 'bottom');

                    if (grandChildren[2] != null) {
                        var x = this.reader.getFloat(grandChildren[1], 'x');
                        var y = this.reader.getFloat(grandChildren[1], 'y');
                        var z = this.reader.getFloat(grandChildren[1], 'z');
                        var third = vec3.fromValues(x, y, z);
                    } else {
                        var third = vec3.fromValues(0, 1, 0);
                    }

                    var camera = new CGFcameraOrtho(left, right, bottom, top, near, far, from, to, third);

                    break;
            }

            this.scene.cameras.push(camera);
            this.scene.cameraList[idCamera] = numCameras;
            numCameras++;

            if (idCamera == idDefaultCamera) {
                this.scene.camera = camera;
                this.scene.interface.setActiveCamera(this.scene.camera);
            }
        }

        if (numCameras == 0) {
            this.log("There's no camera/view defined in XML. Using the default one...");
            var defaultCamera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
            this.scene.camera = defaultCamera;
            this.scene.interface.setActiveCamera(this.scene.camera);
            this.scene.cameras.push(defaultCamera);
            this.scene.cameraList["defaultCamera"] = 0;
        } else {
            this.log("Parsed views and created cameras");
        }

        this.scene.interface.gui.add(this.scene, 'selectedCamera', this.scene.cameraList).onChange(this.scene.onSelectedCameraChanged.bind(this.scene)).name('Camera');

        return null;
    }

    /**
     * Parses the <illumination> node.
     * @param {illumination block element} illuminationsNode
     */
    parseIllumination(illuminationsNode) {

        var children = illuminationsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed illumination");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "light") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["enable", "position", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["boolean", "position", "color", "color", "color"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "boolean")
                        var aux = this.parseBoolean(grandChildren[attributeIndex], "value", "enabled attribute for light of ID" + lightId);
                    else if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (typeof aux === 'string')
                        return aux;

                    global.push(aux);
                }
                else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
            }

            this.lights[lightId] = global;

            numLights++;
        }

        if (numLights == 0) {
            var defaultLight = [];
            var position = [];
            var color = [];
            color.push(...[0.5, 0.5, 0.5, 1.0]);
            position.push(...[10, 10, 10]);
            defaultLight[0] = 1; // value
            defaultLight[1] = position; // position
            defaultLight[2] = color; // ambient
            defaultLight[3] = color; // diffuse
            defaultLight[4] = color; // specular
            this.lights["defaultLight"] = defaultLight;
            this.log("At least one light must be defined. Using the default one...");
        } else if (numLights > 8)
            this.onXMLMinorError("Too many lights defined; WebGL imposes a limit of 8 lights.");
        else
            this.log("Parsed lights");

        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {

        var children = texturesNode.children;

        this.textures = [];
        var numTextures = 0;

        //For each texture in textures block, check ID and file URL
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "texture") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current texture.
            var textureID = this.reader.getString(children[i], 'id');
            if (textureID == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.textures[textureID] != null)
                return "ID must be unique for each texture (conflict: ID = " + textureID + ")";

            // Get path of the current texture.
            var texturePath = this.reader.getString(children[i], 'path');
            if (texturePath == null)
                return "no path defined for texture";

            this.texture = new CGFtexture(this.scene, texturePath);
            this.textures[textureID] = this.texture;
            numTextures++;

        }

        if (numTextures == 0)
            this.log("At least one texture must be defined. The application of textures will be ignored.");
        else
            this.log("Parsed textures");

        return null;
    }

    /**
     * Parses the <spritesheets> block. 
     * @param {spritesheets block element} spritesheetsNode
     */
    parseSpritesheets(spritesheetsNode) {

        var children = spritesheetsNode.children;

        this.spritesheets = [];
        var numSpritesheets = 0;

        //For each spritesheet in spritesheets block, check ID, file URL, sizeM and sizeN
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "spritesheet") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current spritesheet.
            var spritesheetID = this.reader.getString(children[i], 'id');
            if (spritesheetID == null)
                return "no ID defined for spritesheet";

            // Checks for repeated IDs.
            if (this.spritesheets[spritesheetID] != null)
                return "ID must be unique for each spritesheet (conflict: ID = " + spritesheetID + ")";

            // Get path of the current spritesheet.
            var spritesheetPath = this.reader.getString(children[i], 'path');
            if (spritesheetPath == null)
                return "no path defined for spritesheet";

            // Get sizeM of the current spritesheet.
            var spritesheetM = this.reader.getFloat(children[i], 'sizeM');
            if (spritesheetM == null)
                return "no sizeM defined for spritesheet";
            else if (spritesheetM <= 0)
                return "invalid sizeM for spritesheet";

            // Get sizeN of the current spritesheet.
            var spritesheetN = this.reader.getFloat(children[i], 'sizeN');
            if (spritesheetN == null)
                return "no sizeN defined for spritesheet";
            else if (spritesheetN <= 0)
                return "invalid sizeN for spritesheet";

            this.spritesheet = new MySpriteSheet(this.scene, spritesheetPath, spritesheetM, spritesheetN);
            this.spritesheets[spritesheetID] = this.spritesheet;
            numSpritesheets++;

        }

        if (numSpritesheets == 0)
            this.log("At least one spritesheet must be defined. The application of spritesheets will be ignored.");
        else
            this.log("Parsed spritesheets");

        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        this.materials = [];
        var numMaterials = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {

            // Storing material information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of material
            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            } else {
                attributeNames.push(...["shininess", "ambient", "diffuse", "specular", "emissive"]);
                attributeTypes.push(...["value", "color", "color", "color", "color"]);
            }

            // Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each light (conflict: ID = " + materialID + ")";

            grandChildren = children[i].children;
            // Specifications for the current material.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "value")
                        var aux = this.reader.getFloat(grandChildren[attributeIndex], 'value');
                    else if (attributeTypes[j] == "color")
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " color for ID" + materialID);

                    if (typeof aux === 'string')
                        return aux;

                    global.push(aux);
                } else
                    return "material " + attributeNames[i] + " undefined for ID = " + materialID;
            }
            this.material = new CGFappearance(this.scene);
            this.material.setAmbient(global[1][0], global[1][1], global[1][2], global[1][3]);
            this.material.setDiffuse(global[2][0], global[2][1], global[2][2], global[2][3]);
            this.material.setSpecular(global[3][0], global[3][1], global[3][2], global[3][3]);
            this.material.setEmission(global[4][0], global[4][1], global[4][2], global[4][3]);
            this.material.setShininess(global[0]);
            this.materials[materialID] = this.material;
            numMaterials++;
        }

        if (numMaterials == 0) {
            this.log("At least one material must be defined. Using a default material...");
            this.material = new CGFappearance(this.scene);
            this.material.setAmbient(0.5, 0.5, 0.5, 1.0);
            this.material.setDiffuse(0.5, 0.5, 0.5, 1.0);
            this.material.setSpecular(0.5, 0.5, 0.5, 1.0);
            this.material.setEmission(0.5, 0.5, 0.5, 1.0);
            this.material.setShininess(5.0);
            this.materials["defaultMaterial"] = this.material;
        } else
            this.log("Parsed materials");

        return null;
    }

    /**
     * Parses the <animations> node.
     * @param {animations block element} animationsNode
     */
    parseAnimations(animationsNode) {
        var children = animationsNode.children;

        this.animations = [];
        var numAnimations = 0;

        var grandChildren = [];

        // Any number of animations.
        for (var i = 0; i < children.length; i++) {

            // Storing animation information
            var intervals = [];

            //Check type of material
            if (children[i].nodeName != "animation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current animation.
            var animationID = this.reader.getString(children[i], 'id');
            if (animationID == null)
                return "no ID defined for animation";

            // Checks for repeated IDs.
            if (this.animations[animationID] != null)
                return "ID must be unique for each light (conflict: ID = " + animationID + ")";

            grandChildren = children[i].children;
            // Keyframes for the current animation.

            // As one keyframe must be defined, if it's not,
            // the current animation is ignored
            if (grandChildren.length == 0) {
                this.log("At least one keyframe must be defined");
                continue;
            }

            for (var j = 1; j < grandChildren.length; j++) {
                var iinicial = this.reader.getFloat(grandChildren[j - 1], 'instant');
                var ifinal = this.reader.getFloat(grandChildren[j], 'instant');
                var tinicial = [];
                var tfinal = [];

                var grandgrandChildren1 = grandChildren[j - 1].children;
                var grandgrandChildren2 = grandChildren[j].children;

                if (grandgrandChildren1.length != 5) {
                    this.log("Invalid number of transformations");
                    continue;
                }
                if (grandgrandChildren2.length != 5) {
                    this.log("Invalid number of transformations");
                    continue;
                }

                for (var k = 0; k < grandgrandChildren1.length; k++) {
                    switch (k) {
                        case 0:
                            if (grandgrandChildren1[k].nodeName != "translation")
                                return "Error in geometric transformations order.";
                            var x = this.reader.getFloat(grandgrandChildren1[k], 'x');
                            var y = this.reader.getFloat(grandgrandChildren1[k], 'y');
                            var z = this.reader.getFloat(grandgrandChildren1[k], 'z');
                            var transformation = vec3.fromValues(x, y, z);
                            break;
                        case 1:
                            var axis = this.reader.getString(grandgrandChildren1[k], 'axis');
                            if (grandgrandChildren1[k].nodeName != "rotation" || axis != "x")
                                return "Error in geometric transformations order.";
                            var transformation = this.reader.getFloat(grandgrandChildren1[k], 'angle');
                            var transformation = this.degrees_to_radians(transformation);
                            break;
                        case 2:
                            var axis = this.reader.getString(grandgrandChildren1[k], 'axis');
                            if (grandgrandChildren1[k].nodeName != "rotation" || axis != "y")
                                return "Error in geometric transformations order.";
                            var transformation = this.reader.getFloat(grandgrandChildren1[k], 'angle');
                            var transformation = this.degrees_to_radians(transformation);
                            break;
                        case 3:
                            var axis = this.reader.getString(grandgrandChildren1[k], 'axis');
                            if (grandgrandChildren1[k].nodeName != "rotation" || axis != "z")
                                return "Error in geometric transformations order.";
                            var transformation = this.reader.getFloat(grandgrandChildren1[k], 'angle');
                            var transformation = this.degrees_to_radians(transformation);
                            break;
                        case 4:
                            if (grandgrandChildren1[k].nodeName != "scale")
                                return "Error in geometric transformations order.";
                            var sx = this.reader.getFloat(grandgrandChildren1[k], 'sx');
                            var sy = this.reader.getFloat(grandgrandChildren1[k], 'sy');
                            var sz = this.reader.getFloat(grandgrandChildren1[k], 'sz');
                            var transformation = vec3.fromValues(sx, sy, sz);
                            break;
                        default:
                            break;
                    }
                    tinicial.push(transformation);
                }

                for (var k = 0; k < grandgrandChildren2.length; k++) {
                    switch (k) {
                        case 0:
                            if (grandgrandChildren2[k].nodeName != "translation")
                                return "Error in geometric transformations order.";
                            var x = this.reader.getFloat(grandgrandChildren2[k], 'x');
                            var y = this.reader.getFloat(grandgrandChildren2[k], 'y');
                            var z = this.reader.getFloat(grandgrandChildren2[k], 'z');
                            var transformation = vec3.fromValues(x, y, z);
                            break;
                        case 1:
                            var axis = this.reader.getString(grandgrandChildren2[k], 'axis');
                            if (grandgrandChildren2[k].nodeName != "rotation" || axis != "x")
                                return "Error in geometric transformations order.";
                            var transformation = this.reader.getFloat(grandgrandChildren2[k], 'angle');
                            break;
                        case 2:
                            var axis = this.reader.getString(grandgrandChildren2[k], 'axis');
                            if (grandgrandChildren2[k].nodeName != "rotation" || axis != "y")
                                return "Error in geometric transformations order.";
                            var transformation = this.reader.getFloat(grandgrandChildren2[k], 'angle');
                            break;
                        case 3:
                            var axis = this.reader.getString(grandgrandChildren2[k], 'axis');
                            if (grandgrandChildren2[k].nodeName != "rotation" || axis != "z")
                                return "Error in geometric transformations order.";
                            var transformation = this.reader.getFloat(grandgrandChildren2[k], 'angle');
                            break;
                        case 4:
                            if (grandgrandChildren2[k].nodeName != "scale")
                                return "Error in geometric transformations order.";
                            var sx = this.reader.getFloat(grandgrandChildren2[k], 'sx');
                            var sy = this.reader.getFloat(grandgrandChildren2[k], 'sy');
                            var sz = this.reader.getFloat(grandgrandChildren2[k], 'sz');
                            var transformation = vec3.fromValues(sx, sy, sz);
                            break;
                        default:
                            break;
                    }
                    tfinal.push(transformation);

                }

                intervals.push(iinicial);
                intervals.push(ifinal);
                intervals.push(tinicial);
                intervals.push(tfinal);
            }

            Object.freeze(Animation.prototype);
            var animation = new KeyframeAnimation(this.scene, intervals);
            this.animations[animationID] = animation;
            numAnimations++;
        }

        if (numAnimations == 0)
            this.log("There isn't a single animation defined");

        this.log("Parsed animations");

        return null;
    }

    /**
   * Parses the <nodes> block.
   * @param {nodes block element} nodesNode
   */
    parseNodes(nodesNode) {
        var children = nodesNode.children;

        this.nodes = [];

        var grandChildren = [];
        var nodeNames = [];

        // Any number of nodes.
        for (var i = 0; i < children.length; i++) {

            var auxiliar = [];

            if (children[i].nodeName != "node") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current node.
            var nodeID = this.reader.getString(children[i], 'id');
            if (nodeID == null)
                return "no ID defined for nodeID";

            // Checks for repeated IDs.
            if (this.nodes[nodeID] != null)
                return "ID must be unique for each node (conflict: ID = " + nodeID + ")";

            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var transformationsIndex = nodeNames.indexOf("transformations");
            var materialIndex = nodeNames.indexOf("material");
            var textureIndex = nodeNames.indexOf("texture");
            var descendantsIndex = nodeNames.indexOf("descendants");
            var animationIndex = nodeNames.indexOf("animationref");

            // Animation

            if (animationIndex != -1) {
                var animationID = this.reader.getString(grandChildren[animationIndex], 'id');
                var animation = this.animations[animationID];
            } else {
                var animation = null;
            }

            // Material

            // Get id of the current material.
            var materialID = this.reader.getString(grandChildren[materialIndex], 'id');

            if (materialID != "null" && this.materials[materialID] == null) {
                return "no material with this ID";
            }

            auxiliar.push(materialID);

            // Texture

            // Get id of the current texture.
            var textureID = this.reader.getString(grandChildren[textureIndex], 'id');

            if (textureID != "null" && textureID != "clear" && this.textures[textureID] == null) {
                return "no texture with this ID";
            }

            var grandgrandChildren = grandChildren[textureIndex].children;

            var afs = this.reader.getFloat(grandgrandChildren[0], 'afs');
            var aft = this.reader.getFloat(grandgrandChildren[0], 'aft');

            var textureInfo = [];

            textureInfo.push(textureID);
            textureInfo.push(afs);
            textureInfo.push(aft);

            auxiliar.push(textureInfo);

            // Transformations

            var grandgrandChildren = grandChildren[transformationsIndex].children;

            var transformations = mat4.create();

            for (var l = 0; l < grandgrandChildren.length; l++) {
                switch (grandgrandChildren[l].nodeName) {
                    case 'translation':
                        var x_ts = this.reader.getFloat(grandgrandChildren[l], 'x');
                        var y_ts = this.reader.getFloat(grandgrandChildren[l], 'y');
                        var z_ts = this.reader.getFloat(grandgrandChildren[l], 'z');
                        var translation = vec3.fromValues(x_ts, y_ts, z_ts);
                        mat4.translate(transformations, transformations, translation);
                        break;
                    case 'rotation':
                        var ax = this.reader.getString(grandgrandChildren[l], 'axis');
                        var ag = this.reader.getFloat(grandgrandChildren[l], 'angle');
                        switch (ax) {
                            case 'x':
                                mat4.rotateX(transformations, transformations, this.degrees_to_radians(ag));
                                break;
                            case 'y':
                                mat4.rotateY(transformations, transformations, this.degrees_to_radians(ag));
                                break;
                            case 'z':
                                mat4.rotateZ(transformations, transformations, this.degrees_to_radians(ag));
                                break;
                            default:
                                return "The transformation is invalid";
                        }
                        break;
                    case 'scale':
                        var x_sc = this.reader.getFloat(grandgrandChildren[l], 'sx');
                        var y_sc = this.reader.getFloat(grandgrandChildren[l], 'sy');
                        var z_sc = this.reader.getFloat(grandgrandChildren[l], 'sz');
                        var scale = vec3.fromValues(x_sc, y_sc, z_sc);
                        mat4.scale(transformations, transformations, scale);
                        break;
                    default:
                        return "The transformation is invalid";
                }
            }

            auxiliar.push(transformations);

            // Descendants

            var grandgrandChildren = grandChildren[descendantsIndex].children;

            var child = [];
            var leaf = [];

            for (var l = 0; l < grandgrandChildren.length; l++) {

                switch (grandgrandChildren[l].nodeName) {
                    case 'noderef':
                        var desc_id = this.reader.getString(grandgrandChildren[l], 'id');
                        child.push(desc_id);
                        break;
                    case 'leaf':
                        var leaf_type = this.reader.getString(grandgrandChildren[l], 'type');
                        switch (leaf_type) {
                            case 'rectangle':
                                var x1 = this.reader.getFloat(grandgrandChildren[l], 'x1');
                                var y1 = this.reader.getFloat(grandgrandChildren[l], 'y1');
                                var x2 = this.reader.getFloat(grandgrandChildren[l], 'x2');
                                var y2 = this.reader.getFloat(grandgrandChildren[l], 'y2');
                                var primitive = new MyRectangle(this.scene, x1, y1, x2, y2, afs, aft);
                                leaf.push(primitive);
                                break;
                            case 'cylinder':
                                var height = this.reader.getFloat(grandgrandChildren[l], 'height');
                                var topRadius = this.reader.getFloat(grandgrandChildren[l], 'topRadius');
                                var bottomRadius = this.reader.getFloat(grandgrandChildren[l], 'bottomRadius');
                                var stacks = this.reader.getFloat(grandgrandChildren[l], 'stacks');
                                var slices = this.reader.getFloat(grandgrandChildren[l], 'slices');
                                var primitive = new MyCylinder(this.scene, bottomRadius, topRadius, height, stacks, slices);
                                leaf.push(primitive);
                                break;
                            case 'sphere':
                                var radius = this.reader.getFloat(grandgrandChildren[l], 'radius');
                                var slices = this.reader.getFloat(grandgrandChildren[l], 'slices');
                                var stacks = this.reader.getFloat(grandgrandChildren[l], 'stacks');
                                var primitive = new MySphere(this.scene, radius, slices, stacks);
                                leaf.push(primitive);
                                break;
                            case 'triangle':
                                var x1 = this.reader.getFloat(grandgrandChildren[l], 'x1');
                                var y1 = this.reader.getFloat(grandgrandChildren[l], 'y1');
                                var x2 = this.reader.getFloat(grandgrandChildren[l], 'x2');
                                var y2 = this.reader.getFloat(grandgrandChildren[l], 'y2');
                                var x3 = this.reader.getFloat(grandgrandChildren[l], 'x3');
                                var y3 = this.reader.getFloat(grandgrandChildren[l], 'y3');
                                var primitive = new MyTriangle(this.scene, x1, x2, x3, y1, y2, y3, 0, 0, 0, afs, aft);
                                leaf.push(primitive);
                                break;
                            case 'torus':
                                var inner = this.reader.getFloat(grandgrandChildren[l], 'inner');
                                var outer = this.reader.getFloat(grandgrandChildren[l], 'outer');
                                var slices = this.reader.getFloat(grandgrandChildren[l], 'slices');
                                var loops = this.reader.getFloat(grandgrandChildren[l], 'loops');
                                var primitive = new MyTorus(this.scene, inner, outer, slices, loops);
                                leaf.push(primitive);
                                break;
                            case 'spritetext':
                                var text = this.reader.getString(grandgrandChildren[l], 'text');
                                var primitive = new MySpriteText(this.scene, text);
                                leaf.push(primitive);
                                break;
                            case 'spriteanim':
                                var ssid = this.reader.getString(grandgrandChildren[l], 'ssid');
                                var startCell = this.reader.getFloat(grandgrandChildren[l], 'startCell');
                                var endCell = this.reader.getFloat(grandgrandChildren[l], 'endCell');
                                var duration = this.reader.getFloat(grandgrandChildren[l], 'duration');
                                if (this.spritesheets[ssid] == null) {
                                    this.log("Invalid spritesheet");
                                } else {
                                    var primitive = new MySpriteAnimation(this.scene, this.spritesheets[ssid], startCell, endCell, duration);
                                    leaf.push(primitive);
                                }
                                break;
                            case 'plane':
                                var npartsU = this.reader.getFloat(grandgrandChildren[l], 'npartsU');
                                var npartsV = this.reader.getFloat(grandgrandChildren[l], 'npartsV');
                                if (npartsU <= 0) {
                                    this.log("Invalid values for npartsU");
                                    npartsU = 1;
                                } else if (npartsV <= 0) {
                                    this.log("Invalid values for npartsV");
                                    npartsV = 1;
                                }
                                var primitive = new Plane(this.scene, npartsU, npartsV, afs, aft);
                                leaf.push(primitive);
                                break;
                            case 'patch':
                                var npointsU = this.reader.getString(grandgrandChildren[l], 'npointsU');
                                var npointsV = this.reader.getString(grandgrandChildren[l], 'npointsV');
                                var npartsU = this.reader.getFloat(grandgrandChildren[l], 'npartsU');
                                var npartsV = this.reader.getFloat(grandgrandChildren[l], 'npartsV');
                                var grand3Children = grandgrandChildren[l].children;
                                var controlPoints = [];
                                if (grand3Children.length != (npointsU * npointsV)) {
                                    this.log("Invalid number of control points");
                                } else {
                                    var aux = 0;
                                    for (var j = 0; j <= npartsU; j++) {
                                        var uList = [];
                                        for (var k = 0; k <= npartsV; k++) {
                                            var x = this.reader.getFloat(grand3Children[aux], 'x');
                                            var y = this.reader.getFloat(grand3Children[aux], 'y');
                                            var z = this.reader.getFloat(grand3Children[aux], 'z');
                                            var vList = [x, y, z, 1];
                                            uList.push(vList);
                                            aux++;
                                        }
                                        controlPoints.push(uList);
                                    }
                                    var primitive = new Patch(this.scene, npointsU, npointsV, npartsU, npartsV, controlPoints);
                                    leaf.push(primitive);
                                }
                                l++;
                                break;
                            case 'defbarrel':
                                var base = this.reader.getFloat(grandgrandChildren[l], 'base');
                                var middle = this.reader.getFloat(grandgrandChildren[l], 'middle');
                                var height = this.reader.getFloat(grandgrandChildren[l], 'height');
                                var slices = this.reader.getFloat(grandgrandChildren[l], 'slices');
                                var stacks = this.reader.getFloat(grandgrandChildren[l], 'stacks');
                                var primitive = new defbarrel(this.scene, base, middle, height, slices, stacks);
                                leaf.push(primitive);
                                break;
                            default:
                                this.log("Invalid primitive");
                        }
                        break;
                    default:
                        this.log("The descendant is invalid");
                }
            }

            auxiliar.push(child);
            auxiliar.push(leaf);

            auxiliar.push(animation);

            // Node completed
            this.nodes[nodeID] = auxiliar;
        }

        this.log("Parsed nodes");
        return null;
    }


    parseBoolean(node, name, messageError) {
        var boolVal = true;
        boolVal = this.reader.getBoolean(node, name);
        if (!(boolVal != null && !isNaN(boolVal) && (boolVal == true || boolVal == false)))
            this.onXMLMinorError("unable to parse value component " + messageError + "; assuming 'value = 1'");

        return boolVal || 1;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        this.displayLoop(this.idRoot, this.materials[this.nodes[this.idRoot][0]], this.textures[this.nodes[this.idRoot][1][0]]);
    }

    displayLoop(id, parentMaterial, parentTexture) {

        //Aplicação dos materiais
        if (this.nodes[id][0] == "null") {
            try {
                parentMaterial.apply();
            } catch (err) {
                //this.log("Material undefined or invalid");
                //this.log(err);
            }
        } else {
            try {
                this.materials[this.nodes[id][0]].apply();
            } catch (err) {
                //this.log("Material undefined or invalid");
                //this.log(err);
            }
        }

        //Aplicação das texturas
        if (this.nodes[id][1][0] == "null") {
            var aux_material = new CGFappearance(this.scene);
            aux_material.setTexture(parentTexture);
            aux_material.apply();
        }
        else if (this.nodes[id][1][0] == "clear") {
            var aux_material = new CGFappearance(this.scene);
            aux_material.setTexture(null);
            aux_material.apply();
        } else {
            try {
                var aux_material = new CGFappearance(this.scene);
                aux_material.setTexture(this.textures[this.nodes[id][1][0]]);
                aux_material.apply();
            } catch (err) {
                this.log("Texture undefined or invalid");
                this.log(err);
            }
        }

        this.scene.pushMatrix();
        // TG
        this.scene.multMatrix(this.nodes[id][2]);

        // Se existir um id de animação para o nó
        if (this.nodes[id][5] != null) {
            try {
                this.nodes[id][5].apply();
            } catch (err) {
                this.log("There's an error in the animation application");
            }
        }

        //Leaf
        for (var k = 0; k < this.nodes[id][4].length; k++) {
            try {
                this.nodes[id][4][k].display();
            } catch (err) {
                this.log("The primitive is undefined or invalid");
                this.log(err);
            }
        }

        //Child
        for (var i = 0; i < this.nodes[id][3].length; i++) {
            this.displayLoop(this.nodes[id][3][i], this.materials[this.nodes[id][0]], this.textures[this.nodes[id][1][0]]);
        }

        this.scene.popMatrix();

    }

    updateAnimation(instant) {
        this.updateAnimationLoop(instant, this.idRoot);
    }

    updateAnimationLoop(instant, id) {
        if (this.nodes[id][5] != null) {
            this.nodes[id][5].update(instant);
        }

        for (var k = 0; k < this.nodes[id][4].length; k++) {
            try {
                this.nodes[id][4][k].update(instant);
            } catch (err) {
                // It's not a MySpriteAnimation
            }
        }

        for (var i = 0; i < this.nodes[id][3].length; i++) {
            this.updateAnimationLoop(instant, this.nodes[id][3][i]);
        }
    }
}
