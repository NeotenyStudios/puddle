/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   rigidBodyClass.js                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mgras <mgras@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/04/18 13:23:30 by mgras             #+#    #+#             */
/*   Updated: 2017/04/25 19:07:10 by mgras            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

let RigidBody = function(parentGameObject, config) {
	if (parentGameObject === undefined) {
		console.error('noParentGameObject bounded to the RigidBody module');
		return (null);
	}
	this.parentGameObject = parentGameObject;
	this.x = parentGameObject.position.x;
	this.y = parentGameObject.position.y;
	this.width = parentGameObject.size.x;
	this.height = parentGameObject.size.y;
	this.min = new Vector();
	this.max = new Vector();
	this.mass = 100;
	this.invmass = 1/100;
	this.restitution = 1;
	this.velocity = new Vector();
	this.maxSpeed = {
		x : 5,
		y : 5
	}
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
		this.velocity.x *= this.velocity.x < 0 ? -1 : 1;
	}
	if (this.x + this.width > this.parentGameObject.engine.width)
	{
		this.x = this.parentGameObject.engine.width - this.width - 1;
		this.velocity.x *= this.velocity.x > 0 ? -1 : 1;
	}
	if (this.y < 0)
	{
		this.y = 0 + 1
		this.velocity.y *= this.velocity.y < 0 ? -1 : 1;
	}
	if (this.y + this.height > this.parentGameObject.engine.height)
	{
		this.y = this.parentGameObject.engine.height - this.height - 1
		this.velocity.y *= this.velocity.y > 0 ? -1 : 1;
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

RigidBody.prototype.overlapAABB = function(b) {
	let manifold = {};
	let yOverlap;
	let a = this;
	let normal = new Vector({x : b.x - a.x, y : b.y - a.y});
	let aExtent = (a.max.x - a.min.x) / 2;
	let bExtent = (b.max.x - b.min.x) / 2;
	let xOverlap = aExtent + bExtent - Math.abs(normal.x);

	aExtent = (a.max.y - a.min.y) / 2;
	bExtent = (b.max.y - b.min.y) / 2;
	yOverlap = aExtent + bExtent - Math.abs(normal.y);
	if (xOverlap < yOverlap)
	{
		if (normal.x < 0)
			manifold.normal = new Vector({x : -1, y : 0});
		else
			manifold.normal = new Vector({x : 1, y : 0});
		manifold.penetration = Math.abs(xOverlap);
	}
	else
	{
		if (normal.y < 0)
			manifold.normal = new Vector({x : 0, y : -1});
		else
			manifold.normal = new Vector({x : 0, y : 1});
		manifold.penetration = Math.abs(yOverlap);
	}
	return (manifold);
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

RigidBody.prototype.applyGravity = function() {
	if (this.velocity.y < this.maxSpeed.y)
	this.velocity.y += this.mass / 1000;
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
	let percent = 0.2;
	let slope = 0.05;

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

RigidBody.prototype.checkCollision = function(b) {
	let manifold;

	if (this.isColliding(b))
	{
		manifold = this.overlapAABB(b);
		this.resolveCollision(b, manifold);
	}
}