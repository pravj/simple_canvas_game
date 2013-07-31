// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Bullet image
var bulletRaedy = false;
var bulletImage = new Image();
bulletImage.onload = function () {
	bulletReady = true;
};
bulletImage.src = "images/bullet.png";

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var monster = {};
var monstersCaught = 0;
// added new object [bullet]
var bullet = new Array(4)
{
	bullet[0] = {speed:64}
	bullet[1] = {speed:64}
	bullet[2] = {speed:64}
	bullet[3] = {speed:64}
};

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var turn = 0;
var reset = function () {
	/* intial hero Co-ordinates {exact middle}
    
        hero.x = canvas.width/2;
	    hero.y = canvas.height/2;
    	*/
    	
	// :: [set its position to recent one, not in middle]
    	turn += 1;
    	if(turn==1)
    	{
    		hero.x = canvas.width/2;
	    	hero.y = canvas.height/2;
    	}
    	else 
    	{
    		hero.x = hero.x;
    		hero.y = hero.y;
    	}

	// Throw the monster somewhere on the screen randomly
	/*
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));
	*/
	/* :: now monster will always inside the boundary */
	var rand_sign = Math.floor(Math.random()*2);
	if(rand_sign==0)
		{var sign = -1;}
	else if(rand_sign==1)
		{var sign = 1;}
	if(sign==1)
	{
	    	monster.x = canvas.width/2+(sign)*(Math.floor(Math.random()*((canvas.width-128)/2)));
	    	monster.y = canvas.height/2+(sign)*(Math.floor(Math.random()*((canvas.height-128)/2)));
	}
    	else if(sign==-1)
    	{
    		monster.x = canvas.width/2+(sign)*(Math.floor(Math.random()*((canvas.width-64)/2)));
    		monster.y = canvas.height/2+(sign)*(Math.floor(Math.random()*((canvas.height-64)/2)));
    	}
    	
    	// for bullet positions
    	bullet[0].x = canvas.width/2+(Math.floor(Math.random()*((canvas.width-128)/2)));
    	bullet[0].y = 32;
    	bullet[1].x = canvas.width/2-(Math.floor(Math.random()*((canvas.width-64)/2)));
    	bullet[1].y = 32; 
    	bullet[2].x = 32;
    	bullet[2].y = canvas.height/2+(Math.floor(Math.random()*((canvas.height-128)/2)));
    	bullet[3].x = 32;
    	bullet[3].y = canvas.height/2-(Math.floor(Math.random()*((canvas.height-64)/2)));
};

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		hero.y -= hero.speed * modifier;
	}
	if (40 in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;
	}

	// Are they touching?
	if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
	) {
		++monstersCaught;
		reset();
	}
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
};

// Let's play this game!
reset();
var then = Date.now();
setInterval(main, 1); // Execute as fast as possible
