/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   gameObjectClass.js                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mgras <mgras@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/04/04 13:45:46 by mgras             #+#    #+#             */
/*   Updated: 2017/04/26 16:04:31 by mgras            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

let gameObject = function (config) {
	this.position		= {
		x : 0,
		y : 0
	}
	this.rotation		= 0;
	this.currentSate	= 'default';
	this.states			= {};
	this.size			= {
		'x'	: 0,
		'y'	: 0
	}
	this.layer			= 0;
	this.name			= config.name;
	this.debug			= {
		'collisionBox' : false,
		'rigidBody' : true,
	}
	this.engine			= config.engine || null;
	this.rigidBody		= null;
	this.name			= config.name || 'object';
	this.hitBoxes		= {};
}

gameObject.prototype.setSize = function(width, height) {
	this.size.x = width;
	this.size.y = height;
	if (this.rigidBody !== null && this.rigidBody !== undefined)
	{
		this.rigidBody.width = width;
		this.rigidBody.height = height;
	}
}

gameObject.prototype.setSpeed = function(x, y) {
	if (this.rigidBody)
		this.rigidBody.setVelocity(x, y);
}

gameObject.prototype.resolveRigidBody = function(rB) {
	if (this.rigidBody && rB)
		this.rigidBody.checkCollision(rB);
}

gameObject.prototype.resolveHitBoxes = function(hB) {
	for (let hitbox in this.hitBoxes)
	{
		if (this.hitBoxes[hitbox].delete === false)
			this.hitBoxes[hitbox].checkHit(hB);
		else
			this.hitBoxes[hitbox].removeSelf();
	}
}

gameObject.prototype.loadImage = function(url) {
	let		downloadingImage	= new Image();
	const	position			= this.image.files.length;

	this.image.files[position] = new Image();
	this.image.isLoading += 1;
	downloadingImage.onload = function(_this) {
		_this.image.files[position].src = url;
		_this.image.files[position].isReady = true;
		_this.image.isLoading -= 1;
		_this.image.frames++;
	}(this);
	downloadingImage.src = url;
}

gameObject.prototype.loadImageArray = function(urlArray) {
	for (image in urlArray) {
		this.loadImage(urlArray[image]);
		this.image.isAnime = true;
		this.image.frames = urlArray.length;
	}
}

gameObject.prototype.setMass = function(newMass) {
	if (this.rigidBody)
		this.rigidBody.setMass(newMass);
}

gameObject.prototype.draw = function(awakening, progress) {
	const stateToDraw = this.states[this.currentSate];

	if (stateToDraw !== undefined)
		stateToDraw.draw(this, this.engine.canvas);
	if (this.rigidBody !== null)
		this.rigidBody.drawDebug(this.debug.rigidBody, this.engine.canvas);
	for (let hB in this.hitBoxes)
		this.hitBoxes[hB].drawDebug(true, this.engine.canvas);
}

gameObject.prototype.getFramePlacement = function(elapsedTime) {
	const	percentElapsed	= ((elapsedTime / this.image.speedRatio) * 100);
	const	aproxFramePos	= (this.image.frames * percentElapsed) / 100;
	let 	roundedFramePos;

	roundedFramePos = Math.round(aproxFramePos * 10) / 10;
	roundedFramePos = Math.floor(roundedFramePos);
	if (roundedFramePos >= this.image.frames)
		return (this.image.frames - 1);
	else
		return (roundedFramePos);
}

gameObject.prototype.updateRigidBody = function() {
	if (this.rigidBody)
		this.rigidBody.update();
}

gameObject.prototype.updateHitBoxes = function() {
	for (let hB in this.hitBoxes)
		this.hitBoxes[hB].update();
}

gameObject.prototype.move = function(x, y) {
	this.position.x = x;
	this.position.y = y;
	if (this.rigidBody !== null) {
		this.rigidBody.move(x, y);
	}
}

gameObject.prototype.addAnimationState = function(stateName, urlArray) {
	this.states[stateName] = new AnimationState();
	this.states[stateName].loadImageUrl(urlArray);
}

gameObject.prototype.addRigidBody = function(config) {
	this.rigidBody = new RigidBody(this, config);
}

gameObject.prototype.addHitBox = function(config) {
	if (!config)
		config = {};
	let holder = new HitBox(this, config);

	this.hitBoxes[holder.name] = holder;
}

gameObject.prototype.removeHitBox = function(name) {
	if (this.hitBoxes[name])
		this.hitBoxes[name].delete = true;
}