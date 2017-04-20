/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   awakeningClass.js                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mgras <mgras@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/04/04 13:09:03 by mgras             #+#    #+#             */
/*   Updated: 2017/04/20 14:36:38 by mgras            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

let Awakening = function(config) {
	console.log(config);
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
}

Awakening.prototype.calculateLogic = function(progress) {
	for (let object in this.objects) {
		const stamp = object;

		this.objects[object].updateRigidBody();
		for (let rB in this.objects)
		{
			if (rB != stamp)
				this.objects[object].resolveRigidBody(this.objects[rB].rigidBody);
		}
	}
};

Awakening.prototype.draw = function(progress) {
	this.forwardAnimationStates(progress);
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