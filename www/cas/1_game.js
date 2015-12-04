

// Draw everything
function loadSprite(src, callback){
	var sprite = new Image();
	sprite.onload = callback;
	sprite.src = src;
	return sprite;
}


function reset_user(object) {
	object.x = world.width / 2;
	object.y = world.height / 2;
	object.destination={x: object.x, y: object.y};
};


function reset() {
	reset_user(user);
};

function check_intersection(object_a, object_b){
	return (object_a.x <= (object_b.x + object_b.width) && object_b.x <= (object_a.x + object_a.width) && object_a.y <= (object_b.y + object_b.height) && object_b.y <= (object_a.y + object_a.height));
}

function drawGrid(offset){
	ctx.fillStyle = "rgb(64, 64, 64)";
	for(x=0; x<=world.width+32; x+=32){
		ctx.fillRect(offset.x+x, offset.y+0, 1, world.height);
	}
	for(y=0; y<=world.height+32; y+=32){
		ctx.fillRect(offset.x+0, offset.y+y, world.width, 1);
	}
}

var render = function () {
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	var offset={x: -user.x+canvas.width/2, y: -user.y+canvas.height/2};


	if (bgReady) {
		ctx.drawImage(bgImage, world.x+offset.x, world.y+offset.y, world.width, world.height);
	}
	ctx.fillStyle = "rgb(128, 255, 255)";
	ctx.fillRect(offset.x+user.destination.x+user.width/2-3, offset.y+user.destination.y+user.height/2-3, 7, 7);
	//drawGrid(offset);

	ctx.drawImage(user.img, user.x+offset.x, user.y+offset.y);

	for(var i=0; i<humansToRescue.length; i++){
		if (humansToRescue[i].enabled) {
			ctx.drawImage(humansToRescue[i].img, humansToRescue[i].x+offset.x, humansToRescue[i].y+offset.y);
		}
	}
	for(var i=0; i<dangers.length; i++){
		if (dangers[i].enabled) {
			ctx.drawImage(dangers[i].img, dangers[i].x+offset.x, dangers[i].y+offset.y);
		}
	}
	ctx.fillStyle = "rgba(128, 250, 128, .5)";
	ctx.fillRect(offset.x+rassemblement.x, offset.y+rassemblement.y, +rassemblement.width, +rassemblement.height);

	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Objectif : sauver les personnes dans le batiment", 8, 24*0+8*1);

	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Personnes sauvées: " + user.score+"/"+humansToRescue.length, 8, 24*1+8*2);


};


// Update game objects
var update = function (delta) {
	level=Math.floor(user.score/10.0);
	game_speed=1+level/10.0;
	var modifier=delta*game_speed;


	if(pressed){
		user.destination={x: user.x-canvas.width/2 + mouse_x-user.width/2, y: user.y-canvas.height/2 + mouse_y-user.height/2};
		console.log(user.destination);
		released=false;
	}
	var dir_x=user.destination.x-user.x;
	var dir_y=user.destination.y-user.y;
	var distance=Math.sqrt(dir_x*dir_x + dir_y*dir_y);
	if(distance>=user.width/8.){
		dir_x/=distance;
		dir_y/=distance;
		var new_x = user.x+user.speed * modifier*dir_x;
		var new_y = user.y+user.speed * modifier*dir_y;

		if(new_y>=0 && new_y< world.height-user.height){
			user.y = new_y;
		} else if(new_y<0) {
			user.y = 0;
		} else {
			user.y = world.height-user.height;
		}

		if(new_x>=0 && new_x< world.width-user.width){
			user.x = new_x;
		} else if(new_x<0) {
			user.x = 0;
		} else {
			user.x = world.width-user.width;
		}
	}
	for(var i=0; i<humansToRescue.length; i++){
		if (humansToRescue[i].enabled && check_intersection(user, humansToRescue[i])) {
			user.score++;
			humansToRescue[i].enabled=false;
		}
	}
	for(var i=0; i<dangers.length; i++){
		if (dangers[i].enabled && check_intersection(user, dangers[i])) {
			reset_user(user);
		}
	}
};



// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};






// Create the canvas
var canvas = document.createElement("canvas");
canvas.id = 'game-canvas-'+case_id;
canvas.width = 540;
canvas.height = 320;
document.getElementById('game-wrapper-'+case_id).appendChild(canvas);

var ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;





// Background image
var bgReady = false;
var bgImage = loadSprite("images/map_cas_1.png", function(){bgReady = true;});


var userReady = false;
var userImage = loadSprite("images/perso1.png", function(){userReady = true;});

var humanAReady = false;
var humanAImage = loadSprite("images/perso2.png", function(){humanAReady = true;});
var humanBReady = false;
var humanBImage = loadSprite("images/perso3.png", function(){humanBReady = true;});

// Monster image
var fumeeReady = false;
var fumeeImage = loadSprite("images/Fumee1.png", function(){fumeeReady = true;});


// Game objects
var world = {
	x: 0,
	y: 0,
	width: 640*3,
	height: 384*3
};
var user = {
	x: 0,
	y: 0,
	width: 32,
	height: 32,
	img: userImage,
	destination: {x: 0, y: 0},
	speed: 256,
	score: 0
};


var rassemblement = {
	x: 1802,
	y: 365,
	width: 64,
	height: 150
};

var humansToRescue = [];
humansToRescue.push({
	x: world.width*1./5,
	y: world.height*1./4,
	width: 32,
	height: 32,
	img: humanAImage,
	enabled: true
});
humansToRescue.push({
	x: world.width*1./5,
	y: world.height*3./4,
	width: 32,
	height: 32,
	img: humanAImage,
	enabled: true
});
humansToRescue.push({
	x: world.width*3./5,
	y: world.height*1./4,
	width: 32,
	height: 32,
	img: humanAImage,
	enabled: true
});
humansToRescue.push({
	x: world.width*3./5,
	y: world.height*3./4,
	width: 32,
	height: 32,
	img: humanAImage,
	enabled: true
});
var dangers = [];
for(var n=0; n<30; n++){
	dangers.push({
		x: Math.random()*world.width,
		y: Math.random()*world.height,
		width: 32+32*Math.random(),
		height: 32+32*Math.random(),
		img: fumeeImage,
		enabled: true
	});
}

// Handle keyboard input
var keysDown = {};

// Handle mouse input
var pressed=false;
var released=false;

var press_count=0;

var mouse_x = 0;
var mouse_y = 0;

var press_x = 0;
var press_y = 0;

var release_x = 0;
var release_y = 0;

// http://miloq.blogspot.fr/2011/05/coordinates-mouse-click-canvas.html
function pointer_pos(canvas, event){
	x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
	y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;

        x -= canvas.offsetLeft;
        y -= canvas.offsetTop;
	return {x: x, y: y};
}


function mouse_move(e) {
	var pos=pointer_pos(canvas, e);
	mouse_x = pos.x;
	mouse_y = pos.y;
}




function mouse_press(e) {
	var pos=pointer_pos(canvas, e);
	pressed = true;
	mouse_x = pos.x;
	mouse_y = pos.y;
}

function mouse_release(e) {
	var pos=pointer_pos(canvas, e);

	pressed  = false;
	released = true;
	release_x= pos.x;
	release_y= pos.y;
}
function mouse_click(e) {
	if(!pressed){
		mouse_press(e);
		mouse_release(e);
	}
}

canvas.addEventListener ("click", mouse_click, false);
canvas.addEventListener ("mousemove", mouse_move, false);
canvas.addEventListener ("mousedown", mouse_press, false);
canvas.addEventListener ("mouseup", mouse_release, false);


// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
var game_speed=1.0;
var level=0;
reset();
main();
