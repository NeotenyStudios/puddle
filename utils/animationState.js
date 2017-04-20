/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   animationState.js                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mgras <mgras@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/04/04 18:05:05 by mgras             #+#    #+#             */
/*   Updated: 2017/04/05 19:02:17 by mgras            ###   ########.fr       */
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

AnimationState.prototype.loadImage = function(url) {
	let		downloadingImage	= new Image();
	const	position			= this.files.length;

	this.files[position] = new Image();
	this.isLoading += 1;
	this.frames = this.files.length
	downloadingImage.onload = function(_this) {
		_this.files[position].src = url;
		_this.files[position].isReady = true;
		_this.isLoading -= 1;
	}(this);
	downloadingImage.src = url;
}

AnimationState.prototype.loadImageUrl = function(urlArray) {
	for (image in urlArray) {
		this.loadImage(urlArray[image]);
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
		canvas.drawImage(image, objectContext.position.x, objectContext.position.y);
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