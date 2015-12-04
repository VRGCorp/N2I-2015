

// Draw everything
function loadSprite(src, callback){
	var sprite = new Image();
	sprite.onload = callback;
	sprite.src = src;
	return sprite;
}

function reset_object(object) {
	object.x = 0;
	object.y = 0;
	object.destination={x: 0, y: 0};
};

function center_object(object) {
	object.x = world.width / 2;
	object.y = world.height / 2;
	object.destination={x: object.x, y: object.y};
};


function reset() {
	center_object(hero);
	reset_object(monster);
	reset_object(life);
	reset_object(star);
};

function check_intersection(object_a, object_b){
	return (object_a.x <= (object_b.x + object_b.width) && object_b.x <= (object_a.x + object_a.width) && object_a.y <= (object_b.y + object_b.height) && object_b.y <= (object_a.y + object_a.height));
}


var render = function () {
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	var offset={x: -hero.x+canvas.width/2, y: -hero.y+canvas.height/2};


	if (bgReady) {
		ctx.drawImage(bgImage, world.x+offset.x, world.y+offset.y, world.width, world.height);
	}
	/*
	ctx.fillStyle = "rgb(64, 64, 64)";
	for(x=0; x<=world.width+32; x+=32){
		ctx.fillRect(offset.x+x, offset.y+0, 1, world.height);
	}
	for(y=0; y<=world.height+32; y+=32){
		ctx.fillRect(offset.x+0, offset.y+y, world.width, 1);
	}
	*/


	if (heroReady) {
		ctx.drawImage(heroImage, hero.x+offset.x, hero.y+offset.y);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x+offset.x, monster.y+offset.y);
	}
	if (lifeReady) {
		ctx.drawImage(lifeImage, life.x+offset.x, life.y+offset.y);
	}
	if (starReady) {
		ctx.drawImage(starImage, star.x+offset.x, star.y+offset.y);
	}

	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Life: " + hero.life, 8, 24*0+8*1);

	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Score: " + hero.score, 8, 24*1+8*2);

	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Level: " +level, 8, 24*2+8*3);

	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Game speed: " +game_speed, 8, 24*3+8*4);
};


// Update game objects
var update = function (delta) {
	console.log(hero.destination);
	level=Math.floor(hero.score/10.0);
	game_speed=1+level/10.0;
	var modifier=delta*game_speed;


	if(released){
		hero.destination={x: hero.x-canvas.width/2 + mouse_x-hero.width/2, y: hero.y-canvas.height/2 + mouse_y-hero.height/2};
		console.log(hero.destination);
		released=false;
	}
	var dir_x=hero.destination.x-hero.x;
	var dir_y=hero.destination.y-hero.y;
	var distance=Math.sqrt(dir_x*dir_x + dir_y*dir_y);
	if(distance>=hero.width/8.){
		dir_x/=distance;
		dir_y/=distance;
		var new_x = hero.x+hero.speed * modifier*dir_x;
		var new_y = hero.y+hero.speed * modifier*dir_y;

		if(new_y>=0 && new_y< world.height-hero.height){
			hero.y = new_y;
		} else if(new_y<0) {
			hero.y = 0;
		} else {
			hero.y = world.height-hero.height;
		}

		if(new_x>=0 && new_x< world.width-hero.width){
			hero.x = new_x;
		} else if(new_x<0) {
			hero.x = 0;
		} else {
			hero.x = world.width-hero.width;
		}
	}


	monster.x-=monster.speed*modifier;
	life.x-=life.speed*modifier;
	star.x-=life.speed*modifier;

	if(monster.x<0){
		reset_object(monster);
	}
	if(life.x<0){
		reset_object(life);
		life.x+=canvas.width*2;
	}
	if(star.x<0){
		reset_object(star);
		star.x+=canvas.width;
	}

	// Are they touching?
	if (check_intersection(hero, monster)) {
		hero.life--;
		reset_object(monster);
	}
	if (check_intersection(hero, life)) {
		hero.life++;
		reset_object(life);
		life.x+=canvas.width*2;
	}
	if (check_intersection(hero, star)) {
		hero.score++;
		reset_object(star);
		star.x+=canvas.width;
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

var canvas_offset=$(canvas).offset();




// Background image
var bgReady = false;
var bgImage = loadSprite("images/map_cas_4.png", function(){bgReady = true;});


// Hero image
var heroReady = false;
var heroImage = loadSprite("images/perso1.png", function(){heroReady = true;});

// Monster image
var monsterReady = false;
var monsterImage = loadSprite("images/monster.png", function(){monsterReady = true;});

// Life image
var lifeReady = false;
var lifeImage = loadSprite("images/life.png", function(){lifeReady = true;});

// Star image
var starReady = false;
var starImage = loadSprite("images/star.png", function(){starReady = true;});

// Game objects
var world = {
	x: 0,
	y: 0,
	width: 640*3,
	height: 384*3
};
var hero = {
	life: 10,
	score: 0,
	x: 0,
	y: 0,
	destination: {x: 0, y: 0},
	width: 32,
	height: 32,
	speed: 128 // movement in pixels per second
};
var monster = {
	x: 0,
	y: 0,
	width: 32,
	height: 32,
	speed: 128 // movement in pixels per second
};
var life = {
	x: 0,
	y: 0,
	width: 32,
	height: 32,
	speed: 64 // movement in pixels per second
};
var star = {
	x: 0,
	y: 0,
	width: 32,
	height: 32,
	speed: 64 // movement in pixels per second
};

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
	if (event.x != undefined && event.y != undefined){
		x = event.x;
		y = event.y;
	}else{
		x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
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
	if(press_count==0){
		var pos=pointer_pos(canvas, e);

		pressed = true;
		released=false;
		press_x = pos.x;
		press_y = pos.y;
	}
	press_count++;
}

function mouse_release(e) {
	press_count--;
	if(press_count==0){
		var pos=pointer_pos(canvas, e);

		pressed  = false;
		released = true;
		release_x= pos.x;
		release_y= pos.y;
	}
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
