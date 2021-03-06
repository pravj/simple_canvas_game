// to keep track of score on every visit
if (localStorage.pagecount)
{
	localStorage.pagecount=Number(localStorage.pagecount) +1;
}
else
{
	localStorage.pagecount=1;
}
// set localstorage keys on first visit
if(localStorage.pagecount==2)
{
	localStorage.setItem("medium",0);
	localStorage.setItem("tiny",0);
}

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

var flag;
	// pause game after the hit by bullet
var pause = function() {
  	$('#paused').html('you loose with '+monstersCaught);
  	// now pause all
  	hero.speed = 0;
  	monster.speed = 0;
  	for(var a=0;a<4;a++)
  	{bullet[a].speed = 0;}
  	flag = true;
}


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
	
	//  for bound hero inside the park
  if(hero.x<32)
  {
    hero.x = 32;
  }
  if(hero.y<32)
  {
    hero.y = 32;
  }
  if(hero.x>canvas.width-64)
  {
    hero.x = canvas.width-64;
  }
  if(hero.y>canvas.height-64)
  {
    hero.y = canvas.height-64;
  }
  
  // for bound monster inside [while moving]
  if(monster.x<32)
  {
    monster.x = 32;
  }
  if(monster.y<32)
  {
    monster.y = 32;
  }
  if(monster.x>canvas.width-64)
  {
    monster.x = canvas.width-64;
  }
  if(monster.y>canvas.height-64)
  {
    monster.y = canvas.height-64;
  }


	/* adding AI :: but still it's having problems :: */ 
	
	// applying motion in goblin
    	// using concept of COM(center of mass) 
	// for tracking relative position of whole body
    
	// COM co-ordinates
	var Mcom = {
	    X: monster.x+16,
		Y: monster.y+16
	};
	var Hcom = {
	    X: hero.x+16,
		Y: hero.y+16
	};
	// D : distance between COM's
	var xy = (Hcom.X-Mcom.X)*(Hcom.X-Mcom.X)+(Hcom.Y-Mcom.Y)*(Hcom.Y-Mcom.Y);
	var D = Math.sqrt(xy);
	// console.log(D);
	// if D is in a fixed range
	if(D<=300)
	{
	    // region will be from 1 to 9 [relative region]
	    // to detect the relative region
		// detects with refrence to monster

		// upper-left
		if((Mcom.X>Hcom.X) && (Mcom.Y>Hcom.Y))
		{
		    region = 1;
		}
		// upper-right
		if((Mcom.X<Hcom.X) && (Mcom.Y>Hcom.Y))
		{
		    region = 2;
		}
		// lower-right
		if((Mcom.X<Hcom.X) && (Mcom.Y<Hcom.Y))
		{
		    region = 3;
		}
		// lower-left
		if((Mcom.X>Hcom.X) && (Mcom.Y<Hcom.Y))
		{
		    region = 4;
		}

		// added Math.abs() check in just up,down,left,right cases
		// otherwise last check was just not-showing result
		// as the exact state occurs only for miliseconds

		// just upside
		if((Math.abs(Mcom.X-Hcom.X)<=4) && (Mcom.Y>Hcom.Y))
		{
		    region = 5;
		}
		// just right
		if((Math.abs(Mcom.Y-Hcom.Y)<=4) && (Mcom.X<Hcom.X))
		{
		    region = 6;
		}
		// just down-side
		if((Math.abs(Mcom.X-Hcom.X)<=4) && (Mcom.Y<Hcom.Y))
		{
		    region = 7;
		}
		// just left
		if((Math.abs(Mcom.Y-Hcom.Y)<=4) && (Mcom.X>Hcom.X))
		{
		    region = 8;
		}
		// exact same
		// not actually happens
		// because they hit each-other before this
		if((Mcom.X==Hcom.X) && (Mcom.Y==Hcom.Y))
		{
		    region = 9;
		}
	}
	    // now monster will act according to region
	    	if(region==1)
		{
		    monster.x += monster.speed * modifier;
			monster.y += monster.speed * modifier;
		}
		if(region==2)
		{
		    monster.x -= monster.speed * modifier;
			monster.y += monster.speed * modifier;
		}
		if(region==3)
		{
		    monster.x -= monster.speed * modifier;
			monster.y -= monster.speed * modifier;
		}
		if(region==4)
		{
		    monster.x += monster.speed * modifier;
			monster.y -= monster.speed * modifier;
		}
		if(region==5)
		{
		    // stucked at left bottom corner
			if(Math.abs(monster.x-32)<=4)
			{
			    monster.x += monster.speed * modifier;
			}
			// stucked at right bottom corner
			else if(Math.abs(monster.x-canvas.width+64)<=4)
			{
			    monster.x -= monster.speed * modifier;
			}
			// in between corners
			else
			{   monster.y += monster.speed * modifier;}
		}
		if(region==6)
		{
			// stucked at upper left corner
			if(Math.abs(monster.x-32)<=4)
			{
			    monster.y += monster.speed * modifier;
			}
			// stucked at left bottom corner
			else if(Math.abs(monster.x-32)<=4)
			{
			    monster.y -= monster.speed * modifier;
			}
			// in between corners
			else
			{   monster.x -= monster.speed * modifier;}
		}
		if(region==7)
		{
			// stucked at upper left corner
			if(Math.abs(monster.x-32)<=4)
			{
			    monster.x += monster.speed * modifier;
			}
			// stucked at upper right corner
			else if(Math.abs(monster.x-canvas.width+64)<=4)
			{
			    monster.x -= monster.speed * modifier;
			}
			// in between corners
			else
			{   monster.y -= monster.speed * modifier;}
		}
		if(region==8)
		{
		    // stucked at upper right corner
			if(Math.abs(monster.x-canvas.width+64)<=4)
			{
			    monster.y += monster.speed * modifier;
			}
			// stucked at bottom right corner
			else if(Math.abs(monster.x-canvas.width+64)<=4)
			{
			    monster.y -= monster.speed * modifier;
			}
			// in between corners
			else
			{   monster.x += monster.speed * modifier;}
		}
		
		//for bullet motion
		if(true)
		{
			bullet[0].y += modifier*bullet[0].speed;
			bullet[1].y += modifier*bullet[1].speed;
			bullet[2].x += modifier*bullet[2].speed;
			bullet[3].x += modifier*bullet[3].speed;

        		var i = 0;
    			for(i=0;i<4;i++)
    			{
    				if (
    				bullet[i].x >= (hero.x-8) 
    				&& bullet[i].x <= (hero.x+40)
    				&& bullet[i].y >= (hero.y-8)
    				&& bullet[i].y <= (hero.y+40)
    				) 
    				{pause();}

    			}
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
	
	if(bulletReady) {
	    ctx.drawImage(bulletImage, bullet[0].x, bullet[0].y);
	    ctx.drawImage(bulletImage, bullet[1].x, bullet[1].y);
	    ctx.drawImage(bulletImage, bullet[2].x, bullet[2].y);
	    ctx.drawImage(bulletImage, bullet[3].x, bullet[3].y);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
};

var change=false;
//for the user define timelimit
function setTimer()
{
    	var change = true; // to alarm that change-detected
    	
	var f = document.getElementById("timer").options[document.getElementById("timer").selectedIndex].text;
	timelimit = f;
	if(f=='45 Sec')
	{timelimit=45000;}
	//console.log(timelimit);
}
if(change==false)
{
	var timelimit = 30000; //still the default
}

function stop()
{
    	if(flag!=true)
	{
	    hero.speed = 0;
	    monster.speed = 0;
	    for(var c=0;c<4;c++)
	    {bullet[c].speed = 0;}


	    if(timelimit==45000)
	    {
	    	if(monstersCaught>Number(localStorage.getItem("medium")))
	        {
		    console.log(monstersCaught);
		    console.log(Number(localStorage.getItem("medium")));
	            localStorage.setItem("medium",monstersCaught);
		}
	    }
	    else if(timelimit==30000)
	    {
	    	if(monstersCaught>Number(localStorage.getItem("tiny")))
	    	{
		    console.log(monstersCaught);
		    console.log(Number(localStorage.getItem("tiny")));
	            localStorage.setItem("tiny",monstersCaught);
		}
	    }		
	}
}

// Let's play this game!
function start()
{
    $('#backside').css('opacity',0);
    reset();
	// The main game loop
    var main = function () {
	var now = Date.now();
	var delta = now - then;
	update(delta / 1000);
	render();
    
	then = now;
    
	// :: score
	$('#score').html('Goblin Caught '+monstersCaught);};

	var then = Date.now();
    	setTimeout('stop()',timelimit);
    	setInterval(main, 1); // Execute as fast as possible
}
