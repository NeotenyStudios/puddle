/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   collisionBox.js                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mgras <mgras@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/04/07 17:41:02 by mgras             #+#    #+#             */
/*   Updated: 2017/04/17 17:50:06 by mgras            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

let CollisionBox = function(parentGameObject, config) {
	if (!parentGameObject) {
		console.error('noParentGameObject bounded to the CollisionBox module');
		return (null);
	}
	config = config !== undefined ? config : {};
	this.position = {
		x : parentGameObject.position.x,
		y : parentGameObject.position.y,
	}
	this.offset = {
		x : config.offsetX || 0,
		y : config.offsetY || 0
	}
	this.width = parentGameObject.size.x;
	this.height = parentGameObject.size.y;
	this.name = config.name + '__' + parentGameObject.name;
	this.resistance = {
		x : 0.2,
		y : 0.2
	}
	this.resistanceTreshold = {
		x : 0.3,
		y : 0.3
	}
	this.bounce = {
		x : 0.2,
		y : 0.2
	};
	this.hitSides = {
		top		: false,
		right	: false,
		bottom	: false,
		left	: false
	}
	parentGameObject.engine.globalCollisionBox[config.name + '__' + parentGameObject.name] = this;
	this.parentGameObject = parentGameObject;
}

CollisionBox.prototype.setHeight = function(height) {
	this.height = height;
}

CollisionBox.prototype.setBounce = function(x, y) {
	this.bounce.x = x;
	this.bounce.y = y;
}

CollisionBox.prototype.setWeight = function(width) {
	this.width = width;
}

CollisionBox.prototype.setPosition = function(x, y) {
	this.position.x = x | this.position.x;
	this.position.y = y | this.position.y;
}

CollisionBox.prototype.checkForCollision = function() {
	this.position.x = this.parentGameObject.position.x + this.offset.x;
	this.position.y = this.parentGameObject.position.y + this.offset.y;

	for (collisionBox in this.parentGameObject.engine.globalCollisionBox) {
		let scannedBox	= this.parentGameObject.engine.globalCollisionBox[collisionBox];

		if (this.name !== scannedBox.name && this.parentGameObject.isGravityBound !== false)
		{
			if (this.position.x < scannedBox.position.x + scannedBox.width && this.position.x + this.width > scannedBox.position.x && this.position.y < scannedBox.position.y + scannedBox.height && this.height + this.position.y > scannedBox.position.y) {
				const boxLeft				= this.position.x;
				const boxRight				= this.position.x + this.width;
				const boxTop				= this.position.y;
				const boxBottom				= this.position.y + this.height;

				const oldBoxLeft			= this.parentGameObject.oldPosition.x;
				const oldBoxRight			= this.parentGameObject.oldPosition.x + this.width;
				const oldBoxTop				= this.parentGameObject.oldPosition.y;
				const oldBoxBottom			= this.parentGameObject.oldPosition.y + this.height;

				this.hitSides.right			= oldBoxRight <= scannedBox.position.x && boxRight > scannedBox.position.x;
				this.hitSides.left			= oldBoxLeft >= scannedBox.position.x + scannedBox.width && boxLeft < scannedBox.position.x + scannedBox.width;
				this.hitSides.top			= oldBoxTop >= scannedBox.position.y + scannedBox.height && boxTop < scannedBox.position.y + scannedBox.height;
				this.hitSides.bottom		= oldBoxBottom <= scannedBox.position.y && boxBottom > scannedBox.position.y;

				if (this.hitSides.bottom)
				{
					this.parentGameObject.acceleration.y = 0;
					this.parentGameObject.speed.y = this.parentGameObject.speed.y * (-this.bounce.y);
					this.parentGameObject.position.y = scannedBox.position.y - this.height;
				}
				if (this.hitSides.top)
				{
					this.parentGameObject.acceleration.y = 0;
					this.parentGameObject.speed.y = this.parentGameObject.speed.y * (-this.bounce.y);
					this.parentGameObject.position.y = scannedBox.position.y + scannedBox.height;
				}
				if (this.hitSides.left)
					this.parentGameObject.position.x = scannedBox.position.x + scannedBox.width + 1;
				if (this.hitSides.right)
					this.parentGameObject.position.x = scannedBox.position.x - this.width - 1;
				if (this.hitSides.left || this.hitSides.right)
				{
					this.parentGameObject.acceleration.x = 0;
					this.parentGameObject.speed.x *= this.bounce.x;
					this.parentGameObject.speed.x *= -1;
					if (scannedBox.parentGameObject.isGravityBound == true)
					{
						scannedBox.parentGameObject.acceleration.x = 0;
						scannedBox.parentGameObject.speed.x += (this.parentGameObject.speed.x * 0.5);
						scannedBox.parentGameObject.speed.x *= -1;
					}
				}
				if (this.hitSides.top || this.hitSides.bottom)
				{
					const speed = this.parentGameObject.speed.x < 0 ? this.parentGameObject.speed.x * -1 : this.parentGameObject.speed.x;

					this.parentGameObject.speed.x -= this.parentGameObject.speed.x * (this.resistance.x / 10)
					if (speed < this.resistanceTreshold && this.resistance.x !== 0)
						this.parentGameObject.speed.x = 0;
				}
			}
		}
	}
}

CollisionBox.prototype.drawDebugLines = function(canvas) {
	canvas.strokeStyle="#000";
	canvas.lineWidth = 1;
	canvas.beginPath();

	//left	
	canvas.moveTo(this.position.x - 1, this.position.y - 1);
	canvas.lineTo(this.position.x - 1, this.position.y + this.height + 1);

	//right
	canvas.moveTo(this.position.x + this.width + 1, this.position.y - 1);
	canvas.lineTo(this.position.x + this.width + 1, this.position.y + this.height + 1);

	//top
	canvas.moveTo(this.position.x + 1 + this.width, this.position.y - 1);
	canvas.lineTo(this.position.x - 1, this.position.y - 1);

	//bottom
	canvas.moveTo(this.position.x - 1, this.position.y + this.height + 1);
	canvas.lineTo(this.position.x + 1 + this.width, this.position.y + this.height + 1);

	canvas.stroke();
}