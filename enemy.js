var ENEMY_ANIM_IDLE_LEFT = 0;
var ENEMY_ANIM_WALK_LEFT = 1;
var ENEMY_ANIM_IDLE_RIGHT = 2;
var ENEMY_ANIM_WALK_RIGHT = 3;
var ENEMY_ANIM_MAX = 4;

var Enemy = function(x, y) 
{	
	this.sprite = new Sprite("Enemy.png");
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
		[0, 1, 2, 3, 4, 5, 6, 7]);
	//this.sprite.setAnimationOffset(0, -55, -87)
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
		[13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]);
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
		[52, 53, 54, 55, 56, 57, 58, 59]);
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
		[65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78]);

	for(var i=0; i<ENEMY_ANIM_MAX; i++)
	{
		this.sprite.setAnimationOffset(i, -55, -87);
	}

	this.position = new vector2();
	this.position.set(x, y);

	this.velocity = new vector2();
	this.velocity.set(0, 0)

	this.moveRight = true;
	this.pause = 0;	

	this.sprite.setAnimation(ENEMY_ANIM_WALK_RIGHT)
};

Enemy.prototype.update = function(dt)
{	
	this.sprite.update(dt);

	if(this.pause > 0)
	{
		this.pause -= dt;
	}
	else
	{
		var ddx = 0;

		var tx = pixelToTile(this.position.x);
		var ty = pixelToTile(this.position.y);
		var nx = (this.position.x)%TILE;
		var ny = (this.position.y)%TILE;
		var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
		var cellright = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty);
		var celldown = cellAtTileCoord(LAYER_PLATFORMS, tx, ty +1);
		var celldiag = cellAtTileCoord(LAYER_PLATFORMS, tx +1, ty +1);

		if(this.moveRight)
		{
			if(celldiag && !cellright)
			{
				ddx = ddx + ENEMY_ACCEL;
				if(this.sprite.currentAnimation != ENEMY_ANIM_WALK_RIGHT && this.velocity.x > -0.5)
					this.sprite.setAnimation(ENEMY_ANIM_WALK_RIGHT)
			}
			else
			{
				this.velocity.x = 0;
				this.moveRight = false;
				this.sprite.setAnimation(ENEMY_ANIM_IDLE_LEFT)
				this.pause = 0.5;
				/*if(this.velocity.x >= 0)
				{
					this.sprite.setAnimation(ENEMY_ANIM_IDLE_RIGHT)
				}*/
			}
		}

		if(!this.moveRight)
		{
			if(celldown && !cell)
			{
				ddx =ddx - ENEMY_ACCEL;
				if(this.sprite.currentAnimation != ENEMY_ANIM_WALK_LEFT && this.velocity.x < -0.5)
					this.sprite.setAnimation(ENEMY_ANIM_WALK_LEFT)
			}	
			else
			{
				this.velocity.x = 0;
				this.moveRight = true;
				this.sprite.setAnimation(ENEMY_ANIM_IDLE_RIGHT)
				this.pause = 0.5;
			}
		}

		this.position.x = Math.floor(this.position.x + (dt * this.velocity.x));
		this.velocity.x = bound(this.velocity.x + (dt * ddx), -ENEMY_MAXDX, ENEMY_MAXDX);
	}
}

Enemy.prototype.draw = function()
{
	this.sprite.draw(context, this.position.x - worldOffsetX, this.position.y);
}