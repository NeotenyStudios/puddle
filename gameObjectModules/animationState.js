/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   animationState.js                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mgras <mgras@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/04/04 18:05:05 by mgras             #+#    #+#             */
/*   Updated: 2017/05/16 09:07:12 by mgras            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

let AnimationState = function (config) {
	let _this = this;

	config				= config | {};
	this.files			= [];
	this.duration		= config.duration | 500;
	this.name			= config.name | 'default';
	this.onFrame		= 0;
	this.isLoading		= 0;
	this.frames			= -1;
	this.elapsedTime	= 0;
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
		_this.isLoading -= 1;
		_this.offset = offset;
	}(this);
	downloadingImage.src = url;
}

AnimationState.prototype.loadImageUrl = function(urlArray, offsetArray) {
	for (image in urlArray) {
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
}

AnimationState.prototype.draw = function(objectContext, canvas) {
	const	localFrame	= this.getFramePlacement()
	const	image		= this.files[localFrame];

	if (image !== undefined)
	{
		if (objectContext.rigidBody !== undefined && objectContext.rigidBody !== null)
			canvas.drawImage(image, objectContext.rigidBody.x + image.offset.x, objectContext.rigidBody.y + image.offset.y);
		else
			canvas.drawImage(image, objectContext.position.x + image.offset.x, objectContext.position.y + image.offset.y);
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