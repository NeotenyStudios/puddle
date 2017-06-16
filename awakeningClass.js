/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   awakeningClass.js                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: anonymous <anonymous@student.42.fr>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/04/04 13:09:03 by mgras             #+#    #+#             */
/*   Updated: 2017/06/16 19:31:34 by anonymous        ###   ########.fr       */
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
	this.layers				= {
		'default'		: new Canvas('default', {width : config.width, height : config.height}),
		'debug'			: new Canvas('debug', {width : config.width, height : config.height}),
		'debug_text'	: new Canvas('debug_text', {width : config.width, height : config.height})
	};
	this.playerNb = 1;
	this.gamepads = [];
	this.localPlayers = [];
	this.camera = {
		x : 0,
		y : 0,
		z : 1
	}
	window.addEventListener('gamepadconnected', function(e) {
		this.searchForGamePads();
	}.bind(_this));
	window.addEventListener('gamepaddisconnected',function(e) {
		_this.gamepads[e.gamepad.index].disconnecting = true;
	}.bind(_this));
	setInterval(function() {
		_this.lastRenderedFrames = _this.renderedFrames;
		_this.renderedFrames = 0;
		_this.elapsedTime = 0;
		_this.layers.debug.ctx.fillText(_this.renderedFrames, 10 , 10);
	}.bind(_this), 1000);
	window.requestAnimationFrame(function(timestamp) {
		_this.loop(timestamp)
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
			if (this.gamepads[index].used === false)
				return (this.gamepads[index]);
		}
	}
	return (null);
}

Awakening.prototype.addCustomGamepadToLoop = function(gamepad) {
	this.gamepads.push(gamepad);
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
	for (let object in this.objects) {
		if (this.objects[object].rigidBody !== null)
			this.objects[object].rigidBody.resetCollide();
	}
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
	layer.ctx.save();
}

Awakening.prototype.draw = function(progress) {
	this.forwardAnimationStates(progress);
	for (let layer in this.layers)
		if (layer !== 'debug_text')
			this.drawCameraTranslation(this.layers[layer]);
	for (let object in this.objects)
		this.objects[object].draw(this, progress);
	if (this.displayFrameRate === true)
	{
		this.layers.debug_text.ctx.font = '20px Arial';
		this.layers.debug_text.ctx.fillText(this.lastRenderedFrames, 25 , 25);
	}
	if (this.displayObjCount === true)
	{
		this.layers.debug_text.ctx.font = '20px Arial';
		this.layers.debug_text.ctx.fillText(this.objNb.toString(), 75 , 25);
	}
};

Awakening.prototype.moveCamera = function(x, y, z) {
	this.camera.x = x;
	this.camera.y = y;
	this.camera.z = z;
}

Awakening.prototype.setZoom = function(zoom) {
	this.camera.z = zoom;
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
		this.layers[layer].ctx.clearRect(-100, -100, this.layers[layer].DOM.width + 200, this.layers[layer].DOM.height + 200);
	}
}

Awakening.prototype.buildObject = function(config){
	if (config === undefined)
		config = {'name' : 'undefined'};
	this.objects[config.name] = new GameObject(config);
	this.objects[config.name].engine = this;
	this.objNb++;
	return (this.objects[config.name]);
}

Awakening.prototype.forwardAnimationStates = function(progress) {
	for (let object in this.objects) {
		for (let state in this.objects[object].states) {
			this.objects[object].states[state].elapsedTime += progress;
		}
	}
}