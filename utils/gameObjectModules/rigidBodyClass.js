/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   rigidBodyClass.js                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mgras <mgras@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/04/18 13:23:30 by mgras             #+#    #+#             */
/*   Updated: 2017/04/20 15:28:35 by mgras            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

let RigidBody = function(parentGameObject, config) {
	if (parentGameObject === undefined) {
		console.error('noParentGameObject bounded to the RigidBody module');
		return (null);
	}
	this.parentGameObject = parentGameObject;
	this.position = new Vector({
		x : parentGameObject.position.x || 0,
		y : parentGameObject.position.y || 0
	});
	this.axisAlignedBoundingBox = {
		min : new Vector({
			x : parentGameObject.position.x || 0,
			y : parentGameObject.position.y || 0
		}),
		max : new Vector({
			x : parentGameObject.position.x + parentGameObject.size.x,
			y : parentGameObject.position.y + parentGameObject.size.y
		})
	};
	this.width = parentGameObject.size.x;
	this.height = parentGameObject.size.y;
	this.velocity = new Vector({
		x : 0,
		y : 0
	});
	this.bounce = 0.2;
	this.mass = gMM(1000, 1500);
	this.invmass = 1 / this.mass;
	this.debugColor = '#000'
	this.gravity = true;
}

RigidBody.prototype.setBounce = function(newBounce) {
	this.bounce = newBounce;
}

RigidBody.prototype.setMass = function(newMass) {
	this.mass = newMass;
	if (newMass == 0)
		this.invmass = 0;
	else
		this.invmass = 1 / newMass;
}

RigidBody.prototype.cmpAxisAlignedBoundingBox = function(b) {
	const a = this.axisAlignedBoundingBox;
	b = b.axisAlignedBoundingBox;

	if (a.max.x < b.min.x || a.min.x > b.max.x)
		return (false);
	else if (a.max.y < b.min.y || a.min.y > b.max.y)
		return (false);
	else
		return (true);
}

RigidBody.prototype.overlapAABB = function(b) {
	let normal = new Vector({
		x : b.position.x - this.position.x,
		y : b.position.y - this.position.y
	});
	let aExtent = (this.axisAlignedBoundingBox.max.x - this.axisAlignedBoundingBox.min.x);
	let bExtent = (b.axisAlignedBoundingBox.max.x - b.axisAlignedBoundingBox.min.x);
	let xOverlap = aExtent + bExtent - Math.abs(normal.x);
	let yOverlap;
	let manifold = new Manifold();

	if (xOverlap >= 0)
	{
		aExtent = (this.axisAlignedBoundingBox.max.y - this.axisAlignedBoundingBox.min.y);
		bExtent = (b.axisAlignedBoundingBox.max.y - b.axisAlignedBoundingBox.min.y);
		yOverlap = aExtent + bExtent - Math.abs(normal.y);
		if (yOverlap > 0)
		{
			if (xOverlap < yOverlap)
			{
				if (normal.x < 0)
					manifold.normal = new Vector({x : -1, y : 0});
				else
					manifold.normal = new Vector({x : 1, y : 0});
				manifold.penetration = xOverlap;
				return (manifold);
			}
			else
			{
				if (normal.y < 0)
					manifold.normal = new Vector({x : 0, y : -1});
				else
					manifold.normal = new Vector({x : 0, y : 1});
				manifold.penetration = yOverlap;
				return (manifold);
			}
		}
	}
	return (null);
}

RigidBody.prototype.move = function(x, y) {
	this.position.x = x;
	this.position.y = y;
	this.axisAlignedBoundingBox.min.x = x;
	this.axisAlignedBoundingBox.min.y = y;
	this.axisAlignedBoundingBox.max.x = x + this.width;
	this.axisAlignedBoundingBox.max.y = y + this.height;
}

RigidBody.prototype.drawDebug = function(permission, canvas) {
	if (permission === true) {
		canvas.strokeStyle= this.debugColor;
		canvas.lineWidth = 1;
		canvas.beginPath();

		canvas.moveTo(this.position.x - 1, this.position.y - 1);
		canvas.lineTo(this.position.x - 1, this.position.y + this.height + 1);

		canvas.moveTo(this.position.x + this.width + 1, this.position.y - 1);
		canvas.lineTo(this.position.x + this.width + 1, this.position.y + this.height + 1);

		canvas.moveTo(this.position.x + 1 + this.width, this.position.y - 1);
		canvas.lineTo(this.position.x - 1, this.position.y - 1);

		canvas.moveTo(this.position.x - 1, this.position.y + this.height + 1);
		canvas.lineTo(this.position.x + 1 + this.width, this.position.y + this.height + 1);

		canvas.stroke();
	}
}

RigidBody.prototype.updateAxisAlignedBoundaryBox = function() {
	this.axisAlignedBoundingBox = {
		min : new Vector({
			x : this.position.x,
			y : this.position.y
		}),
		max : new Vector({
			x : this.position.x + this.parentGameObject.size.x,
			y : this.position.y + this.parentGameObject.size.y
		})
	};
}

RigidBody.prototype.setVelocity = function(x, y) {
	this.velocity.x = x;
	this.velocity.y = y;
}

RigidBody.prototype.update = function() {
	this.position.x += this.velocity.x;
	this.position.y += this.velocity.y;
	this.updateAxisAlignedBoundaryBox();
}

RigidBody.prototype.resolveCollision = function(b, manifold) {
	const	rv = new Vector({
		x : b.velocity.x - this.velocity.x,
		y : b.velocity.y - this.velocity.y
	});
	const	velAlongNormal = rv.dotProduct(manifold.normal);
	let		impulse = new Vector();
	let		e;
	let		j;
	let		cX;
	let		cY;
	let		percent = 0.05;
	let		slop = 0.1;

	if (velAlongNormal > 0){
		this.debugColor = '#4CAF50';
		return (null);
	}
	else
	{
		e = Math.min(this.bounce, b.bounce);
		j = -(1 + e) * velAlongNormal;
		j /= this.invmass + b.invmass;
		impulse.x = manifold.normal.x * j;
		impulse.y = manifold.normal.y * j;
		this.velocity.x -= (this.invmass * impulse.x);
		this.velocity.y -= (this.invmass * impulse.y);
		b.velocity.x += (b.invmass * impulse.x);
		b.velocity.y += (b.invmass * impulse.y);
		cX = Math.max(manifold.penetration - slop, 0) / (this.invmass + b.invmass) * manifold.normal.x * percent;
		cY = Math.max(manifold.penetration - slop, 0) / (this.invmass + b.invmass) * manifold.normal.y * percent;
		this.position.x -= this.invmass * cX;
		this.position.y -= this.invmass * cY;
		b.position.x += b.invmass * cX;
		b.position.y += b.invmass * cY;
	}
}

RigidBody.prototype.checkCollision = function(b) {
	let manifold;

	if (this.cmpAxisAlignedBoundingBox(b))
	{
		this.debugColor = '#F44336';
		manifold = this.overlapAABB(b);
		if (manifold !== null)
		{
			this.debugColor = '#000';
			this.resolveCollision(b, manifold);
		}
		else
			this.debugColor = '#4CAF50';
	}
	else
		this.debugColor = '#4CAF50';
}