var LC;
var RECT_SIZE = 10;
var RECT_COUNT = 100;

$(document).ready(function(){
    LC = new LaserCommand("canvas");
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
    this.numParticles = 200;
    this.ctx = canvas.getContext("2d");

    $(document).mousemove(function(e) {
        this.mouse.x = e.pageX;
        this.mouse.y = e.pageY;

        //console.log("x: " + this.mouse.x + ", y: " + this.mouse.y);
    }.bind(this));

    this.initParticles();
    this.initRectangles();

    setInterval(this.draw.bind(this), 30);
}

LaserCommand.prototype.initParticles = function(){
    this.particles = [];
    for(var i = 0; i < this.numParticles; i++){
        this.particles.push(new particle(this));
    }
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
    //Painting the canvas black
    //Time for lighting magic
    //particles are painted with "lighter"
    //In the next frame the background is painted normally without blending to the 
    //previous frame
    this.ctx.globalCompositeOperation = "source-over";
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.w, this.h);
    this.ctx.globalCompositeOperation = "lighter";

    // destroy any rectangles hit by the cursor, and draw the remaining
    this.ctx.fillStyle = "white";
    for (var i = 0; i < this.rects.length; i++) {
        if (this.mouse.x > this.rects[i].x && this.mouse.x < this.rects[i].x + RECT_SIZE) {
            if (this.mouse.y > this.rects[i].y && this.mouse.y < this.rects[i].y + RECT_SIZE) {
                this.rects.splice(i, 1);
            }
        }
    }
    for (var i = 0; i < this.rects.length; i++) {
        this.ctx.fillRect(this.rects[i].x, this.rects[i].y, RECT_SIZE, RECT_SIZE);
    }
    
    for(var i = 0; i < this.particles.length; i++){
        var p = this.particles[i];
        this.ctx.beginPath();
        //changing opacity according to the life.
        //opacity goes to 0 at the end of life of a particle
        p.opacity = Math.round(p.remaining_life/p.life*100)/100
        //a gradient instead of white fill
        var gradient = this.ctx.createRadialGradient(p.location.x, p.location.y, 0, p.location.x, p.location.y, p.radius);
        gradient.addColorStop(0, "rgba("+p.r+", "+p.g+", "+p.b+", "+p.opacity+")");
        gradient.addColorStop(0.5, "rgba("+p.r+", "+p.g+", "+p.b+", "+p.opacity+")");
        gradient.addColorStop(1, "rgba("+p.r+", "+p.g+", "+p.b+", 0)");
        this.ctx.fillStyle = gradient;
        this.ctx.arc(p.location.x, p.location.y, p.radius, Math.PI*2, false);
        this.ctx.fill();
        
        // move the particles
        p.remaining_life--;
        p.radius--;
        p.location.x += p.speed.x;
        p.location.y += p.speed.y;
        
        // regenerate particles
        if(p.remaining_life < 0 || p.radius < 0){
            //a brand new particle replacing the dead one
            this.particles[i] = new particle(this);
        }
    }
}

function particle(context){
    //speed, life, location, life, colors
    //speed.x range = -2.5 to 2.5 
    //speed.y range = -15 to -5 to make it move upwards
    //lets change the Y speed to make it look like a flame
    this.speed = {x: -2.5+Math.random()*5, y: -15+Math.random()*10};
    //location = mouse coordinates
    //Now the flame follows the mouse coordinates
    if(context.mouse.x && context.mouse.y){
        this.location = {x: context.mouse.x, y: context.mouse.y};
    } else {
        this.location = {x: context.w/2, y: context.h/2};
    }

    //radius range = 10-30
    this.radius = 0+Math.random()*10;

    //life range = 20-30
    this.life = 20+Math.random()*10;

    this.remaining_life = this.life;

    //colors
    this.r = Math.round(Math.random()*255);
    this.g = Math.round(Math.random()*255);
    this.b = Math.round(Math.random()*255);
}