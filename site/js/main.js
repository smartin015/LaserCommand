var RECT_SIZE = 15;
var RECT_COUNT = 100;

$(document).ready(function(){
    window.LC = new LaserCommand("canvas");
    websocket_init();
})

function LaserCommand(canvasName) {
    var canvas = document.getElementById(canvasName);
    this.resizeCanvas(canvas);
    this.init(canvas);
}

LaserCommand.prototype.resizeCanvas = function(canvas){
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    canvas.width  = this.w;
    canvas.height = this.h;
}

LaserCommand.prototype.init = function(canvas){
    this.mouse = {};
    this.emitters = [];
    this.numParticles = 200;
    this.ctx = canvas.getContext("2d");

    this.initRectangles();

    var fireEmitter = new Emitter(this.w/2, this.h/2, 300, {}, this);
    this.addEmitter(fireEmitter);

    setInterval(this.draw.bind(this), 30);
}

LaserCommand.prototype.addEmitter = function(emitter){
    this.emitters.push(emitter);
}

LaserCommand.prototype.initRectangles = function() {
    this.rects = [];
    for (var i = 0; i < RECT_COUNT; i++) {
        this.rects.push(new rect());
    }
}

function rect() {
    this.x = Math.random()*canvas.width;
    this.y = Math.random()*canvas.height;
}

LaserCommand.prototype.draw = function(){
    this.ctx.globalCompositeOperation = "source-over";
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.w, this.h);
    this.ctx.globalCompositeOperation = "lighter";

    // destroy any rectangles hit by the cursor, and draw the remaining
    this.ctx.fillStyle = "#FF3333";
    for (var i = 0; i < this.rects.length; i++) {
        if (POINTS.x + 5 > this.rects[i].x && POINTS.x - 5 < this.rects[i].x + RECT_SIZE) {
            if (POINTS.y + 5 > this.rects[i].y && POINTS.y - 5 < this.rects[i].y + RECT_SIZE) {
                this.rects.splice(i, 1);
            }
        }
    }
    for (var i = 0; i < this.rects.length; i++) {
        this.ctx.fillRect(this.rects[i].x, this.rects[i].y, RECT_SIZE, RECT_SIZE);
    }

    for (var i = 0; i < this.emitters.length; i++){
        var emitter = this.emitters[i];
        if(emitter.active){
            emitter.emit();
        }
    }
}

function particle(x,y){
    // each particle has a speed, life, location, life, colors

    //lets change the Y speed to make it look like a flame
    this.speed = {x: -2.5+Math.random()*5, y: -15+Math.random()*10};

    //Now the flame follows the mouse coordinates
    if(POINTS.x && POINTS.y){
        this.location = {x: x, y: y};
    } else {
        this.location = {x: x, y: y};
    }

    //radius range = 10-30
    this.radius = 0+Math.random()*15;

    //life range = 20-30
    this.life = 20+Math.random()*10;

    this.remaining_life = this.life;

    //colors
    this.r = Math.round(255);
    this.g = Math.round(Math.random()*80);
    this.b = Math.round(0);
}

function Emitter(x, y, numParticles, particleProperties, appContext){
    this.active = true;
    this.location = {};
    this.location.x = x;
    this.location.y = y;
    this.numParticles = numParticles;
    this.particleProperties = particleProperties;
    this.particles = [];
    this.appContext = appContext;

    for(var i = 0; i < this.numParticles; i++){
        this.particles.push(new particle(this.location.x, this.location.y));
    }

    this.setPos = function(location){
        this.location = location;
    }

    this.emit = function(){
        for(var i = 0; i < this.particles.length; i++){
            var p = this.particles[i];
            
            this.appContext.ctx.beginPath();
            
            // changing opacity according to the life (opacity goes to 0 at the end 
            // of life of a particle
            p.opacity = Math.round(p.remaining_life/p.life*100)/100
            
            //a gradient instead of white fill
            var gradient = this.appContext.ctx.createRadialGradient(p.location.x, p.location.y, 0, p.location.x, p.location.y, p.radius);
            gradient.addColorStop(0, "rgba("+p.r+", "+p.g+", "+p.b+", "+p.opacity+")");
            gradient.addColorStop(0.5, "rgba("+p.r+", "+p.g+", "+p.b+", "+p.opacity+")");
            gradient.addColorStop(1, "rgba("+p.r+", "+p.g+", "+p.b+", 0)");
            
            //this.ctx.fillStyle = gradient;
            this.appContext.ctx.fillStyle = gradient;
            this.appContext.ctx.arc(p.location.x, p.location.y, p.radius, Math.PI*2, false);
            this.appContext.ctx.fill();
            
            p.remaining_life--;
            p.radius--;
            
            // move the particles
            p.location.x += p.speed.x;
            p.location.y += p.speed.y;
            
            // regenerate particles
            if(p.remaining_life < 0 || p.radius < 0){
                //a brand new particle replacing the dead one
                this.particles[i] = new particle(this.location.x, this.location.y);
            }
        }
    }
        
}