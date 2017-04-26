/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   awakeningClass.js                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mgras <mgras@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/04/04 13:09:03 by mgras             #+#    #+#             */
/*   Updated: 2017/04/26 16:18:22 by mgras            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

let Awakening = function(config) {
	console.log(config);
	this.height				= config.height;
	this.width				= config.width;
	this.canvasDOM			= initCanvas(config.width, config.height);
	this.canvas				= this.canvasDOM.getContext('2d');
	this.lastRender			= 0;
	this.objects			= {};
	this.renderedFrames		= 0;
	this.lastRenderedFrames	= this.renderedFrames;
	this.elapsedTime		= 0;
	this.displayFrameRate	= true;
	this.displayObjCount	= true;
	this.objNb				= 0;
	this.hits				= 0;
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
	if (this.displayFrameRate == true) {
		this.canvas.font = '20px Arial';
		this.canvas.fillText(this.lastRenderedFrames, 25 , 25);
	}
	if (this.displayObjCount == true) {
		this.canvas.font = '20px Arial';
		this.canvas.fillText(this.objNb.toString(), 75 , 25);
	}
	this.canvas.font = '20px Arial';
	this.canvas.fillText(this.hits.toString(), 150 , 25);
};

Awakening.prototype.loop = function(timestamp) {
	const progress = timestamp - this.lastRender;

	this.elapsedTime += progress;
	this.clearCanvas();
	this.calculateLogic(progress);
	this.draw(progress);
	this.lastRender = timestamp;
	this.renderedFrames++;
	window.requestAnimationFrame((timestamp) => {this.loop(timestamp)});
};

Awakening.prototype.clearCanvas = function() {
	this.canvas.clearRect(0, 0, this.canvasDOM.width, this.canvasDOM.height);
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