/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   gameObjectClass.js                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mgras <mgras@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/04/04 13:45:46 by mgras             #+#    #+#             */
/*   Updated: 2017/05/16 08:35:15 by mgras            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

let GameObject = function (config) {
	if (config === undefined)
		config = {};
	this.position		= {
		x : config.posX || 0,
		y : config.posY || 0
	}
	this.rotation		= 0; //not used for now
	this.currentSate	= 'default';
	this.states			= {};
	this.size			= {
		'x'	: 0,
		'y'	: 0
	}
	this.layer			= 0;
	this.debug			= {
		'hitBox' : true,
		'rigidBody' : true,
	}
	this.engine			= config.engine || null;
	this.rigidBody		= null;
	this.name			= config.name || 'object';
	this.hitBoxes		= {};
}

GameObject.prototype.setSize = function(width, height) {
	this.size.x = width;
	this.size.y = height;
	if (this.rigidBody !== null && this.rigidBody !== undefined)
	{
		this.rigidBody.width = width;
		this.rigidBody.height = height;
	}
}

GameObject.prototype.toggleGravity = function() {
	if (this.rigidBody)
		this.rigidBody.gravity = this.rigidBody.gravity ? false : true;
}

GameObject.prototype.setSpeed = function(x, y) {
	if (this.rigidBody)
		this.rigidBody.setVelocity(x, y);
}

GameObject.prototype.addSpeed = function(x, y) {
	this.rigidBody.addSpeed(x, y);
}

GameObject.prototype.resolveRigidBody = function(rB) {
	if (this.rigidBody && rB)
		this.rigidBody.checkCollision(rB);
}

GameObject.prototype.resolveHitBoxes = function(hB) {
	for (let hitbox in this.hitBoxes)
	{
		if (this.hitBoxes[hitbox].delete === false)
			this.hitBoxes[hitbox].checkHit(hB);
		else
			this.hitBoxes[hitbox].removeSelf();
	}
}

GameObject.prototype.loadImage = function(url) {
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

GameObject.prototype.loadImageArray = function(urlArray) {
	for (image in urlArray) {
		this.loadImage(urlArray[image]);
		this.image.isAnime = true;
		this.image.frames = urlArray.length;
	}
}

GameObject.prototype.setMass = function(newMass) {
	if (this.rigidBody)
		this.rigidBody.setMass(newMass);
}

GameObject.prototype.draw = function(awakening, progress) {
	const stateToDraw = this.states[this.currentSate];

	if (stateToDraw !== undefined)
		stateToDraw.draw(this, this.engine.layers.debug.ctx);
	if (this.rigidBody !== null)
		this.rigidBody.drawDebug(this.debug.rigidBody, this.engine.layers.debug.ctx);
	for (let hB in this.hitBoxes)
		this.hitBoxes[hB].drawDebug(this.debug.hitBox, this.engine.layers.debug.ctx);
}

GameObject.prototype.getFramePlacement = function(elapsedTime) {
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

GameObject.prototype.updateRigidBody = function() {
	if (this.rigidBody)
		this.rigidBody.update();
}

GameObject.prototype.updateHitBoxes = function() {
	for (let hB in this.hitBoxes)
		this.hitBoxes[hB].update();
}

GameObject.prototype.move = function(x, y) {
	this.position.x = x;
	this.position.y = y;
	if (this.rigidBody !== null) {
		this.rigidBody.move(x, y);
	}
}

GameObject.prototype.addAnimationState = function(stateName, urlArray) {
	this.states[stateName] = new AnimationState();
	this.states[stateName].loadImageUrl(urlArray);
}

GameObject.prototype.addRigidBody = function(config) {
	this.rigidBody = new RigidBody(this, config);
}

GameObject.prototype.addHitBox = function(config) {
	if (!config)
		config = {};
	let holder = new HitBox(this, config);

	this.hitBoxes[holder.name] = holder;
}

GameObject.prototype.removeHitBox = function(name) {
	if (this.hitBoxes[name])
		this.hitBoxes[name].delete = true;
}