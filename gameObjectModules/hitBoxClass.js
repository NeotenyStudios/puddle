/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   hitBoxClass.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mgras <mgras@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/04/17 17:12:14 by mgras             #+#    #+#             */
/*   Updated: 2017/05/16 08:03:58 by mgras            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

let	HitBox = function (parentGameObject, config) {
	if (parentGameObject === undefined || parentGameObject === null)
	{
		console.warn('No parentGameObject in the hitbox module');
		return (null)
	}
	this.handler = function(b) {this.parentGameObject.engine.hits++};
	this.parentGameObject = parentGameObject;
	this.name = 'HB_' + parentGameObject.name + '_' + (config.name || 'undefined');
	this.position = new Vector({
		x : config.posX || this.parentGameObject.position.x,
		y : config.posY || this.parentGameObject.position.y
	});
	this.width = config.width || this.parentGameObject.size.x;
	this.height = config.height || this.parentGameObject.size.y;
	this.debugColor = '#00dd0b';
	this.offset = {
		x : config.offX || 0,
		y : config.offY || 0
	}
	this.max = new Vector({
		x : this.position.x + this.width + this.offset.x,
		y : this.position.y + this.height + this.offset.y
	});
	this.min = new Vector({
		x : this.position.x,
		y : this.position.y
	});
	this.delete = false;
	this.colliding = false;
}

HitBox.prototype.setOffset = function(x, y) {
	this.offset.x = x;
	this.offset.y = y;
}

HitBox.prototype.drawDebug = function(permission, canvas) {
	if (permission === true) {
		canvas.strokeStyle = this.debugColor;
		canvas.lineWidth = 1;
		canvas.beginPath();
		canvas.rect(this.position.x + this.offset.x, this.position.y + this.offset.y, this.width, this.height);
		canvas.stroke();
	}
}

HitBox.prototype.updateAxisAlignedBoundingBox = function() {
	this.max.x = this.position.x + this.width + this.offset.x;
	this.max.y = this.position.y + this.height + + this.offset.y;
	this.min.x = this.position.x + this.offset.x;
	this.min.y = this.position.y + this.offset.y;
}

HitBox.prototype.update = function() {
	this.colliding = false;
	this.position.x = this.parentGameObject.position.x;
	this.position.y = this.parentGameObject.position.y;
	this.updateAxisAlignedBoundingBox();
}

HitBox.prototype.setSize = function(width, height) {
	this.width = width;
	this.height = height;
	this.updateAxisAlignedBoundingBox();
}

HitBox.prototype.move = function(x, y) {
	this.position.x = x;
	this.position.y = y;
	this.updateAxisAlignedBoundingBox();
}

HitBox.prototype.isColliding = function(b) {
	let a = this;

	if (a.max.x < b.min.x || a.min.x > b.max.x)
		return (false);
	if (a.max.y < b.min.y || a.min.y > b.max.y)
		return (false);
	return (true);
}

HitBox.prototype.checkHit = function(b) {
	if (!b || !this)
		return (null);
	if (this.isColliding(b) === true)
	{
		if (this.handler)
			this.handler(b.parentGameObject);
		this.debugColor = '#f44242';
		b.debugColor = '#f44242';
		this.colliding = true;
	}
	else if (this.colliding == false)
	{
		this.debugColor = '#00dd0b';
		b.debugColor = '#00dd0b';
	}
}

HitBox.prototype.removeSelf = function() {
	if (this.delete === true)
	{
		this.parentGameObject.hitBoxes[this.name] = undefined;
		return (null);
	}
	this.delete = true;
}
