/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   awakeningClass.js                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mgras <mgras@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/04/04 13:09:03 by mgras             #+#    #+#             */
/*   Updated: 2017/05/01 18:56:00 by mgras            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

let Awakening = function(config) {
	this.height				= config.height;
	this.width				= config.width;
	this.lastRender			= 0;
	this.objects			= {};
	this.renderedFrames		= 0;
	this.lastRenderedFrames	= this.renderedFrames;
	this.elapsedTime		= 0;
	this.displayFrameRate	= true;
	this.displayObjCount	= true;
	this.displayHitCount	= true;
	this.objNb				= 0;
	this.hits				= 0;
	this.layers				= {
		'default' : new Canvas('default', {width : config.width, height : config.height}),
		'debug' : new Canvas('debug', {width : config.width, height : config.height})
	};
	this.playerNb = 1;
	this.controlers = [new Gamepad(0, this)];
}

Awakening.prototype.calculateLogic = function(progress) {
	for (let object in this.objects)
	{
		this.objects[object].updateRigidBody();
		this.objects[object].updateHitBoxes();
	}
	for (let object in this.objects) {
		let stamp = object;

		for (let b in this.objects)
		{
			if (b !== stamp)
			{
				this.objects[object].resolveRigidBody(this.objects[b].rigidBody);
				for (let hB in this.objects[b].hitBoxes)
					this.objects[object].resolveHitBoxes(this.objects[b].hitBoxes[hB]);
			}
		}
	}
};

Awakening.prototype.draw = function(progress) {
	this.forwardAnimationStates(progress);
	this.clearCanvas();
	for (let object in this.objects) {
		this.objects[object].draw(this, progress);
	}
	if (this.displayFrameRate === true) {
		this.layers.debug.ctx.font = '20px Arial';
		this.layers.debug.ctx.fillText(this.lastRenderedFrames, 25 , 25);
	}
	if (this.displayObjCount === true) {
		this.layers.debug.ctx.font = '20px Arial';
		this.layers.debug.ctx.fillText(this.objNb.toString(), 75 , 25);
	}
	if (this.displayObjCount === true) {
		this.layers.debug.ctx.font = '20px Arial';
		this.layers.debug.ctx.fillText(this.hits.toString(), 150 , 25);
	}
	this.layers.debug.ctx.font = '20px Arial';
	this.layers.debug.ctx.fillText(Math.round(score).toString() + ' + ' + Math.abs(878 - this.objects['blockL0'].position.y) / 100, 50 , 150);
	this.layers.debug.ctx.fillText(Math.round(hScore).toString(), 50 , 250);
};

Awakening.prototype.loop = function(timestamp) {
	const progress = timestamp - this.lastRender;

	this.elapsedTime += progress;
	this.clearCanvas();
	for (let controler in this.controlers)
		this.controlers[controler].update();
	this.calculateLogic(progress);
	this.draw(progress);
	this.lastRender = timestamp;
	this.renderedFrames++;
	window.requestAnimationFrame((timestamp) => {this.loop(timestamp)});
};

Awakening.prototype.clearCanvas = function() {
	for (layer in this.layers) {
		this.layers[layer].ctx.clearRect(0, 0, this.layers[layer].DOM.width, this.layers[layer].DOM.height);
	}
}

Awakening.prototype.buildObject = function(name){
	this.objects[name] = new gameObject({'name' : name});
	this.objects[name].engine = this;
	this.objNb++;
}

Awakening.prototype.forwardAnimationStates = function(progress) {
	for (let object in this.objects) {
		for (let state in this.objects[object].states) {
			this.objects[object].states[state].elapsedTime += progress;
		}
	}
}