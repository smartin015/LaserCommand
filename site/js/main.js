$(document).ready(function(){
    new LaserCommand("canvas");
})

function LaserCommand(canvasName) {
    this.resizeCanvas(canvasName);
    this.init(canvasName);
}

LaserCommand.prototype.init = function(canvasName){
    // constants
    this.bgColor = [0,0,0];
    this.camPosition = [0,0,0];
    this.camLookPoint = [0,0,-1];
    this.particlePosition = [0,0,-20];
    this.particleMinVelocity = [-4,-4,-4];
    this.particleMaxVelocity = [-2,2,2];
    this.particleMinLifetime = .5;
    this.particleMaxLifetime = 1;
    this.particleMinColor = [0.8,0.4,0.4,0.5];
    this.particleMaxColor = [1,0.6,0.6,1];
    this.particleMinSize = .05;
    this.particleMaxSize = .1;
    this.particleAcceleration = [0,-50,0];
    this.particleEmitRate = 100;
    this.totalParticles = 50;


    this.initScene(canvasName);
    this.initCamera(scn);
    this.initParticleSystem();

    scn.setCamera(this.cam); // add the camera to the scene
    scn.startScene(); // start the scene
    scn.addObjectToScene(psys); //add the particle system to the scene
}

LaserCommand.prototype.resizeCanvas = function(canvasName){
    var canvas = document.getElementById(canvasName);
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
}

LaserCommand.prototype.initScene = function(canvasName){
    scn = new c3dl.Scene();
    scn.setCanvasTag(canvasName);

    // create GL context
    renderer = new c3dl.WebGL();

    scn.setBackgroundColor(this.bgColor);

    // attach renderer to the scene
    scn.setRenderer(renderer);
    scn.init();

    this.scn = scn;
}

LaserCommand.prototype.initCamera = function(){
    cam = new c3dl.FreeCamera();
    cam.setPosition(this.camPosition); // place the camera.
    cam.setLookAtPoint(this.camLookPoint); // point camera directly down z-axis
    this.cam = cam;
}

LaserCommand.prototype.initParticleSystem = function(){
    psys = new c3dl.ParticleSystem();
    psys.setPosition(this.particlePosition);

    //set the initial range of velocities possible for each particle
    psys.setMinVelocity(this.particleMinVelocity);
    psys.setMaxVelocity(this.particleMaxVelocity);

    //set the range of time (in seconds) that a particle can last
    psys.setMinLifetime(this.particleMinLifetime);
    psys.setMaxLifetime(this.particleMaxLifetime);

    //Set the range of colours for particles
    psys.setMinColor(this.particleMinColor);
    psys.setMaxColor(this.particleMaxColor);

    //set range of sizes for particle
    psys.setMinSize(this.particleMinSize);
    psys.setMaxSize(this.particleMaxSize);

    //specify how overlapping particles will be rendered
    psys.setSrcBlend(c3dl.ONE);
    psys.setDstBlend(c3dl.DST_ALPHA);

    //set the texture the particles will use
    //psys.setTexture("flare.png");

    //Set the acceleration that will be applied to every particle
    psys.setAcceleration(this.particleAcceleration);

    //Set how many particles the system will emit every second
    psys.setEmitRate(this.particleEmitRate);

    //Set the total number of particles available to the system
    psys.init(this.totalParticles);

    this.psys = psys;
}