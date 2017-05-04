/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   awakeningClass.js                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mgras <mgras@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/04/04 13:09:03 by mgras             #+#    #+#             */
/*   Updated: 2017/05/04 19:07:38 by mgras            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

let Awakening = function(config) {
	let _this = this;

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
	this.gamepads = [];
	this.camera = {
		x : 1,
		y : 1,
		z : 1
	}
	window.addEventListener('gamepadconnected', function(e) {
		this.searchForGamePads();
	}.bind(_this));
	window.addEventListener('gamepaddisconnected', function(e) {
		_this.gamepads[e.gamepad.index].disconnecting = true;
	}.bind(_this));
}

Awakening.prototype.verifGamePad = function(gamepad) {
	if (!gamepad)
		return (null);
	else if (gamepad.id.match('Unknown') !== null && gamepad.mapping !== "standard")
		return (null);
	else
		return (gamepad);
}

Awakening.prototype.getAvailableGamePad = function() {
	if (this.gamepads.length === 0)
		return (null);
	else
	{
		for (let index = 0; index < this.gamepads.length; index++)
		{
			if (this.gamepads[index].used = false)
				return (this.gamepads[index]);
		}
		return (null);
	}
	return (null);
}

Awakening.prototype.searchForGamePads = function() {
	const gamepads = navigator.getGamepads();

	for (let index = 0; index < gamepads.length; index++)
	{
		if (this.verifGamePad(gamepads[index]) !== null)
		{
			console.info('Gamepad event dispached for ' + gamepads[index].index + ' ' + gamepads[index].id);
			this.gamepads[gamepads[index].index] = new Gamepad(gamepads[index].index, this);
			window.dispatchEvent(this.gamepads[gamepads[index].index].readyEvent);
		}
		else if (gamepads[index])
			console.warn('Gamepad event aborted for ' + gamepads[index].index + ' ' + gamepads[index].id);
		else
			console.info('Empty Slot');
	}
}

Awakening.prototype.calculateLogic = function(progress) {
	for (let object in this.objects)
	{
		this.objects[object].updateRigidBody();
		this.objects[object].updateHitBoxes();
	}
	for (let object in this.objects)
	{
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

Awakening.prototype.notifyNoControler = function() {
	console.log('Please plug in a Controler');
}

Awakening.prototype.drawCameraTranslation = function(layer) {
	layer.ctx.setTransform(this.camera.z, 0, 0, this.camera.z, -((this.camera.z - 1) * this.width / 2) + this.camera.x, -((this.camera.z - 1) * this.height / 2) + this.camera.y);
}

Awakening.prototype.draw = function(progress) {
	this.forwardAnimationStates(progress);
	for (let layer in this.layers)
		this.drawCameraTranslation(this.layers[layer]);
	for (let object in this.objects)
		this.objects[object].draw(this, progress);
	if (this.displayFrameRate === true)
	{
		this.layers.debug.ctx.font = '20px Arial';
		this.layers.debug.ctx.fillText(this.lastRenderedFrames, 25 , 25);
	}
	if (this.displayObjCount === true)
	{
		this.layers.debug.ctx.font = '20px Arial';
		this.layers.debug.ctx.fillText(this.objNb.toString(), 75 , 25);
	}
	if (this.displayObjCount === true)
	{
		this.layers.debug.ctx.font = '20px Arial';
		this.layers.debug.ctx.fillText(this.hits.toString(), 150 , 25);
	}
	this.layers.debug.ctx.font = '20px Arial';
	this.layers.debug.ctx.fillText(Math.round(score).toString() + ' + ' + Math.abs(878 - this.objects['blockL0'].position.y) / 100, 50 , 150);
	this.layers.debug.ctx.fillText(Math.round(hScore).toString(), 50 , 250);
};

Awakening.prototype.moveCamera = function(x, y, z) {
	this.camera.x = x;
	this.camera.y = y;
	this.camera.z = z;
}

Awakening.prototype.loop = function(timestamp) {
	const progress = timestamp - this.lastRender;

	this.elapsedTime += progress;
	this.clearCanvas();
	for (let controler in this.gamepads)
		this.gamepads[controler].update();
	this.calculateLogic(progress);
	this.draw(progress);
	this.lastRender = timestamp;
	this.renderedFrames++;
	window.requestAnimationFrame((timestamp) => {this.loop(timestamp)});
};

Awakening.prototype.clearCanvas = function() {
	for (layer in this.layers) {
		this.layers[layer].ctx.clearRect(-10, -10, this.layers[layer].DOM.width + 20, this.layers[layer].DOM.height + 20);
	}
}

Awakening.prototype.buildObject = function(name){
	this.objects[name] = new GameObject({'name' : name});
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