/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   animationState.js                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mgras <mgras@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/04/04 18:05:05 by mgras             #+#    #+#             */
/*   Updated: 2017/08/31 11:58:25 by mgras            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

'use strict';

let AnimationState = function (config) {
	let _this = this;

	config				= config | {};
	this.files			= [];
	this.duration		= config.duration || 1000;
	this.name			= config.name || 'default';
	this.onFrameId		= 0;
	this.lastFrameId	= 0;
	this.isLoading		= 0;
	this.frames			= -1;
	this.elapsedTime	= 0;
	this.reverse		= {
		x : false,
		y : false
	}
	this.clock			= setInterval(function() {
		_this.elapsedTime = 0;
	}.bind(_this), this.duration);
}

AnimationState.prototype.loadImage = function(url, offset) {
	let		downloadingImage	= new Image();
	const	position			= this.files.length;

	if (offset === undefined)
		offset = {x : 0, y : 0};
	this.files[position] = new Image();
	this.isLoading += 1;
	this.frames = this.files.length
	downloadingImage.onload = function(_this) {
		_this.files[position].src = url;
		_this.files[position].isReady = true;
		_this.files[position].offset = offset;
		_this.isLoading -= 1;
	}(this);
	downloadingImage.src = url;
}

AnimationState.prototype.loadImageUrl = function(urlArray, offsetArray) {
	if (offsetArray === undefined)
		offsetArray = [];
	for (let image in urlArray) {
		this.loadImage(urlArray[image], offsetArray[image]);
		this.frames = urlArray.length;
	}
}

AnimationState.prototype.resetClock = function(){
	let _this = this;

	clearInterval(this.clock);
	this.clock = setInterval(function() {
		_this.elapsedTime = 0;
	}.bind(_this), this.duration);
	this.onFrameId = 0;
	this.lastFrameId = -1;
	this.elapsedTime = 0;
}

AnimationState.prototype.flipY = function() {
	this.reverse.y = this.reverse.y === true ? false : true;
}

AnimationState.prototype.flipX = function() {
	this.reverse.x = this.reverse.x === true ? false : true;
}

AnimationState.prototype.manageContextTranslations = function(canvas, posX, posY, image) {
	let xScale = 1;
	let yScale = 1;
	let xTranslate = 0;
	let yTranslate = 0;
	let finalPos = {
		x : posX,
		y : posY
	}

	canvas.save();
	if (this.reverse.x === true)
	{
		xScale = -1;
		xTranslate = canvas.canvas.width;
		finalPos.x = xTranslate - posX - image.width;
	}
	if (this.reverse.y === true)
	{
		yScale = -1;
		yTranslate = canvas.canvas.height;
		finalPos.y = yTranslate - posY - image.height;
	}
	canvas.scale(xScale, yScale);
	canvas.translate(-xTranslate, -yTranslate);
	return (finalPos);
}

AnimationState.prototype.draw = function(objectContext, canvas) {
	this.lastFrameId	= this.onFrameId;
	this.onFrameId		= this.getFramePlacement();
	const	image		= this.files[this.onFrameId];
	let		posX;
	let		posY;
	let		finalPos;

	if (image !== undefined)
	{
		if (objectContext.rigidBody !== undefined && objectContext.rigidBody !== null)
		{
			posX = image.offset.x + objectContext.rigidBody.x;
			posY = image.offset.y + objectContext.rigidBody.y;
		}
		else
		{
			posX = image.offset.x + objectContext.position.x;
			posY = image.offset.y + objectContext.position.y;
		}
		finalPos = this.manageContextTranslations(canvas, posX, posY, image);
		canvas.drawImage(image, finalPos.x, finalPos.y, image.width, image.height);
		canvas.restore();
	}
}

AnimationState.prototype.getFramePlacement = function() {
	const	percentElapsed	= ((this.elapsedTime / this.duration) * 100);
	const	aproxFramePos	= (this.frames * percentElapsed) / 100;
	let		roundedFramePos;

	roundedFramePos = Math.round(aproxFramePos * 10) / 10;
	roundedFramePos = Math.floor(roundedFramePos);
	if (roundedFramePos > this.frames - 1)
		return (this.frames - 1);
	else
		return (roundedFramePos);
}

AnimationState.prototype.setDuration = function(duration) {
	this.duration = duration;
	this.resetClock();
}

AnimationState.prototype.setFrameDuration = function(frameDuration) {
	this.duration = frameDuration * (this.frames + 1);
	this.resetClock();
}