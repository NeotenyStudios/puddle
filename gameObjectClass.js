/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   gameObjectClass.js                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mgras <mgras@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/04/04 13:45:46 by mgras             #+#    #+#             */
/*   Updated: 2017/07/04 22:05:07 by mgras            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

let GameObject = function (config) {
	let _this = this;

	if (config === undefined)
		config = {};
	this.position				= {
		x : config.posX || 0,
		y : config.posY || 0
	}
	this.rotation				= 0; //not used for now
	this.currentSate			= 'default';
	this.states					= {};
	this.size					= {
		'x'	: config.width || 0,
		'y'	: config.width || 0
	}
	this.layer					= 0;
	this.debug					= {
		'hitBox'	: true,
		'rigidBody'	: true,
	}
	this.engine					= config.engine || null;
	this.rigidBody				= null;
	this.name					= config.name || 'object';
	this.hitBoxes				= {};
	this.isChainingAnimations	= false;
	this.animationQueue			= [];
	window.addEventListener(this.name + '_animation', function(handler, data){
		if (handler === undefined)
			return (null);
		handler(data).bind(_this);
	});
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
	let finalHitboxContainer = this.hitBoxes;

	for (let hitbox in this.hitBoxes)
	{
		if (this.hitBoxes[hitbox].delete === false)
			this.hitBoxes[hitbox].checkHit(hB);
		else
			finalHitboxContainer = this.hitBoxes[hitbox].removeSelf();
	}
	this.hitBoxes = finalHitboxContainer;
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

GameObject.prototype.getAnimationQueuePosition = function() {
	let		splicedAnimationQueue	= this.animationQueue;
	let		cState;

	if (this.animationQueue.length !== 0)
	{
		cState = this.states[this.animationQueue[0].stateName];
		if (this.animationQueue[0].started === false)
		{
			cState.resetClock();
			this.animationQueue[0].started = true;
		}
		if (cState.onFrameId > cState.getFramePlacement())
		{
			this.animationQueue[0].callback();
			splicedAnimationQueue.splice(0, 1);
			this.animationQueue = splicedAnimationQueue;
			return (this.getAnimationQueuePosition());
		}
		else
			return (cState);
	}
	else
	{
		this.isChainingAnimations = false;
		this.animationQueue = [];
		return (this.states[this.currentSate]);
	}
}

GameObject.prototype.draw = function(awakening, progress) {
	let stateToDraw;

	stateToDraw = this.getAnimationQueuePosition();
	if (stateToDraw !== undefined)
		stateToDraw.draw(this, this.engine.layers.debug.ctx);
	if (this.rigidBody !== null && this.debug.rigidBody === true)
		this.rigidBody.drawDebug(this.debug.rigidBody, this.engine.layers.debug.ctx);
	if (this.debug.hitBox === true)
	{
		for (let hB in this.hitBoxes)
			this.hitBoxes[hB].drawDebug(this.debug.hitBox, this.engine.layers.debug.ctx);
	}
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

GameObject.prototype.addAnimationState = function(stateName, urlArray, offset) {
	this.states[stateName] = new AnimationState({'name' : this.name + ' ' + stateName});
	if (offset === undefined)
		offset = [];
	this.states[stateName].loadImageUrl(urlArray, offset);
}

GameObject.prototype.addRigidBody = function(config) {
	this.rigidBody = new RigidBody(this, config);
	return (this.rigidBody);
}

GameObject.prototype.addHitBox = function(config) {
	if (!config)
		config = {};
	let holder = new HitBox(this, config);

	this.hitBoxes[holder.name] = holder;
	return (holder);
}

GameObject.prototype.removeHitBox = function(name) {
	if (this.hitBoxes[name])
		this.hitBoxes[name].delete = true;
}

GameObject.prototype.addAnimationToQueue = function(stateName, cb)
{
	let animationParcel = {};

	if (this.states[stateName] === undefined)
		return (null);
	this.states[stateName].resetClock();
	animationParcel.stateName = stateName;
	animationParcel.callback = cb;
	animationParcel.started = false;
	this.animationQueue.push(animationParcel);
	this.isChainingAnimations = true;
	return (animationParcel);
}