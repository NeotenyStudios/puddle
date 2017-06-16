/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   rigidBodyClass.js                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: anonymous <anonymous@student.42.fr>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/04/18 13:23:30 by mgras             #+#    #+#             */
/*   Updated: 2017/06/16 19:29:05 by anonymous        ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

let RigidBody = function(parentGameObject, config) {
	if (parentGameObject === undefined) {
		console.error('noParentGameObject bounded to the RigidBody module');
		return (null);
	}
	if (config === undefined)
		config = {};
	console.log(parentGameObject.size);
	this.parentGameObject = parentGameObject;
	this.x = config.posX || parentGameObject.position.x;
	this.y = config.PosY || parentGameObject.position.y;
	this.width = config.width || parentGameObject.size.x;
	this.height = config.height || parentGameObject.size.y;
	this.min = new Vector();
	this.max = new Vector();
	this.mass = 500;
	this.invmass = 1 / this.mass;
	this.restitution = 0.1;
	this.velocity = new Vector();
	this.debugColor = '#000';
	this.gravity = config.gravity || false;
	this.collide = {
		right	: false,
		left	: false,
		top		: false,
		bot		: false
	};
	this.airFriction = 0;
}

RigidBody.prototype.resolveAirFirction = function() {
	
}

RigidBody.prototype.update = function() {
	this.x += this.velocity.x;
	this.y += this.velocity.y;
	this.min.x = this.x;
	this.min.y = this.y;
	this.max.x = this.x + this.width;
	this.max.y = this.y + this.height;
	this.parentGameObject.position.x = this.x;
	this.parentGameObject.position.y = this.y;
	if (this.x < 0)
	{
		this.x = 1;
		this.velocity.x *= this.velocity.x < 0 ? -this.restitution : this.restitution;
	}
	if (this.x + this.width > this.parentGameObject.engine.width)
	{
		this.x = this.parentGameObject.engine.width - this.width - 1;
		this.velocity.x *= this.velocity.x > 0 ? -this.restitution : this.restitution;
	}
	if (this.y < 0)
	{
		this.y = 0 + 1
		this.velocity.y *= this.velocity.y < 0 ? -this.restitution : this.restitution;
	}
	if (this.y + this.height > this.parentGameObject.engine.height)
	{
		this.y = this.parentGameObject.engine.height - this.height - 1
		this.velocity.y *= this.velocity.y > 0 ? -this.restitution : this.restitution;
	}
}

RigidBody.prototype.setBounce = function(newBounce) {
	this.restitution = newBounce;
}

RigidBody.prototype.setMass = function(newMass) {
	this.mass = newMass;
	if (newMass <= 0)
		this.invmass = 0;
	else
		this.invmass = 1 / newMass;
}

RigidBody.prototype.drawDebug = function(permission, canvas) {
	if (permission === true) {
		canvas.strokeStyle= this.debugColor;
		canvas.lineWidth = 1;
		canvas.beginPath();
		canvas.rect(this.x, this.y, this.width, this.height);
		canvas.stroke();
	}
}

RigidBody.prototype.applyGravity = function() {
	this.velocity.y += this.mass / 1000;
}

RigidBody.prototype.getOverlap = function(b) {
	let overlap = {};

	if (this.min.x > b.min.x && this.max.x > b.max.x) //this is overlapping from the right
		overlap.x = b.max.x - this.min.x;
	else if (this.max.x < b.max.x && this.min.x < b.min.x) //this is overlapping from the left
		overlap.x = this.max.x - b.min.x
	else if (this.max.x >= b.max.x && this.min.x <= b.min.x) //this is containing b
		overlap.x = b.width;
	else if (this.max.x <= b.max.x && this.min.x >= b.min.x) //this is contained by b
		overlap.x = this.width;

	if (this.min.y > b.min.y && this.max.y > b.max.y) //this is overlapping from the bottom
		overlap.y = b.max.y - this.min.y;
	else if (this.max.y < b.max.y && this.min.y < b.min.y) //this is overlapping from the top
		overlap.y = this.max.y - b.min.y
	else if (this.max.y >= b.max.y && this.min.y <= b.min.y) //this is containing b
		overlap.y = b.height;
	else if (this.max.y <= b.max.y && this.min.y >= b.min.y) //this is contained by b
		overlap.y = this.height;
	return (overlap);
}

RigidBody.prototype.overlapAABB = function(b) {
	let manifold = {};
	let a = this;
	let normal = new Vector({x : b.x - a.x, y : b.y - a.y});
	let overlap = this.getOverlap(b);


	if (overlap.x < overlap.y)
	{
		if (normal.x < 0)
		{
			this.collide.left = true;
			b.collide.right = true;
			manifold.normal = new Vector({x : -1, y : 0});
		}
		else
		{
			this.collide.right = true;
			b.collide.left = true;
			manifold.normal = new Vector({x : 1, y : 0});
		}
		manifold.penetration = Math.abs(overlap.x);
	}
	else
	{
		if (normal.y < 0)
		{
			this.collide.top = true;
			b.collide.bot = true;
			manifold.normal = new Vector({x : 0, y : -1});
		}
		else
		{
			this.collide.bot = true;
			b.collide.top = true;
			manifold.normal = new Vector({x : 0, y : 1});
		}
		manifold.penetration = Math.abs(overlap.y);
	}
	return (manifold);
}

RigidBody.prototype.addSpeed = function(x, y) {
	this.velocity.x += x;
	this.velocity.y += y;
}

RigidBody.prototype.move = function(x, y) {
	this.x = x;
	this.y = y;
	this.min.x = this.x;
	this.min.y = this.y;
	this.max.x = this.x + this.width;
	this.max.y = this.y + this.height;
}

RigidBody.prototype.isColliding = function(b) {
	let a = this;

	if (a.max.x < b.min.x || a.min.x > b.max.x)
		return (false);
	if (a.max.y < b.min.y || a.min.y > b.max.y)
		return (false);
	return (true);
}


RigidBody.prototype.setVelocity = function(x, y) {
	this.velocity.x = x;
	this.velocity.y = y;
}

RigidBody.prototype.resolveCollision = function(b, manifold) {
	let a = this;
	let relativeVelocity = new Vector({x : b.velocity.x - a.velocity.x, y : b.velocity.y - a.velocity.y});
	let velAlongNormal = relativeVelocity.dotProduct(manifold.normal);
	let e;
	let j;
	let cX;
	let cY;
	let impulse;
	let percent = 0.8;
	let slope = 0.1;

	if (velAlongNormal > 0)
		return (null);
	else
	{
		e = Math.min(a.restitution, b.restitution);
		j = -(1 + e) * velAlongNormal;
		j /= a.invmass + b.invmass;
		impulse = new Vector({
			x : manifold.normal.x * j,
			y : manifold.normal.y * j
		});
		a.velocity.x -= (a.invmass * impulse.x);
		a.velocity.y -= (a.invmass * impulse.y);
		b.velocity.x += (b.invmass * impulse.x);
		b.velocity.y += (b.invmass * impulse.y);
		cX = Math.max(manifold.penetration - slope, 0) / (a.invmass + b.invmass) * percent * manifold.normal.x;
		cY = Math.max(manifold.penetration - slope, 0) / (a.invmass + b.invmass) * percent * manifold.normal.y;
		a.move(a.x - (a.invmass * cX), a.y - (a.invmass * cY));
		b.move(b.x + (b.invmass * cX), b.y + (b.invmass * cY));
	}
}

RigidBody.prototype.resetCollide = function() {
	this.collide = {
		right	: false,
		left	: false,
		top		: false,
		bot		: false
	};
}

RigidBody.prototype.checkCollision = function(b) {
	let manifold;

	if (this.gravity === true)
		this.applyGravity();
	if (this.isColliding(b))
	{
		manifold = this.overlapAABB(b);
		this.resolveCollision(b, manifold);
	}
}