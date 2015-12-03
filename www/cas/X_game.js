

// Draw everything


function loadSprite(src, callback){
	var sprite = new Image();
	sprite.onload = callback;
	sprite.src = src;
	return sprite;
}

function reset_object(object) {
	object.x = object.width + canvas.width;
	object.y = Math.random() * (canvas.height-object.height);
};

function center_object(object) {
	object.x = canvas.width / 2;
	object.y = canvas.height / 2;
};


function reset() {
	center_object(hero);
	hero.x=canvas.width/3;
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

	ctx.fillStyle = "rgb(64, 64, 64)";
	for(x=0; x<=canvas.width; x+=32){
		ctx.fillRect(x, 0, 1, canvas.height);
	}
	for(y=0; y<=canvas.height; y+=32){
		ctx.fillRect(0, y, canvas.width, 1);
	}
	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}
	if (lifeReady) {
		ctx.drawImage(lifeImage, life.x, life.y);
	}
	if (starReady) {
		ctx.drawImage(starImage, star.x, star.y);
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
	if(released){
		released=false;
		console.log(press_x+":"+press_y);
		console.log(release_x+":"+release_y);
	}
	level=Math.floor(hero.score/10.0);
	game_speed=1+level/10.0;
	var modifier=delta*game_speed;
	if (pressed) {
		var new_y = hero.y-hero.speed * modifier;
		if(new_y>=0){
			hero.y = new_y;
		} else {
			hero.y = 0;
		}
		hero.x=mouse_x;
		hero.y=mouse_y;
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
var ctx = canvas.getContext("2d");
canvas.id = 'game-canvas-'+case_id;
canvas.width = 768;
canvas.height = 128;
document.getElementById('game-wrapper-'+case_id).appendChild(canvas);





// Background image
var bgReady = false;
var bgImage = loadSprite("images/background.png", function(){bgReady = true;});


// Hero image
var heroReady = false;
var heroImage = loadSprite("images/hero.png", function(){heroReady = true;});

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
	width: canvas.width,
	height: canvas.height
};
var hero = {
	life: 10,
	score: 0,
	x: 0,
	y: 0,
	width: 32,
	height: 32,
	speed: 256 // movement in pixels per second
};
var monster = {
	x: 0,
	y: 0,
	width: 32,
	height: 32,
	speed: 256 // movement in pixels per second
};
var life = {
	x: 0,
	y: 0,
	width: 32,
	height: 32,
	speed: 192 // movement in pixels per second
};
var star = {
	x: 0,
	y: 0,
	width: 32,
	height: 32,
	speed: 192 // movement in pixels per second
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

addEventListener ("mousemove", function (e) {
	mouse_x = e.clientX;
	mouse_y = e.clientY;
}, false);

addEventListener ("mousedown", function (e) {
	if(press_count==0){
		pressed = true;
		released=false;
		press_x = e.clientX;
		press_y = e.clientY;
	}
	press_count++;
}, false);

addEventListener ("mouseup", function (e) {
	press_count--;
	if(press_count==0){
		pressed  = false;
		released = true;
		release_x= e.clientX;
		release_y= e.clientY;
	}
}, false);

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);


// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
var game_speed=1.0;
var level=0;
reset();
main();
