/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   playerClass.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: anonymous <anonymous@student.42.fr>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/05/04 16:01:42 by mgras             #+#    #+#             */
/*   Updated: 2017/06/18 21:36:24 by anonymous        ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

let PlayableCharacter = function(engine) {
	if (engine === undefined)
		return (null);
	this.engine			= engine;
	this.boundGamepad	= this.findGamepad();
	this.boundObjects	= {};
	this.boundHitboxes	= {};
	this.config			= {};
}

PlayableCharacter.prototype.findGamepad = function() {
	let gamepad = null;

	if (this.engine.gamepads.length === 0)
		return (null);
	else
	{
		gamepad = this.engine.getAvailableGamePad();
		if (gamepad === null)
			console.info('No available gamepads');
	}
	return (gamepad);
}

PlayableCharacter.prototype.bindNewObject = function(name, config) {
	if (config === undefined)
		config = {'name' : 'undefined'};
	this.boundObjects[name] = engine.buildObject(config);
	return (this.boundObjects[name]);
}

PlayableCharacter.prototype.addHitbox = function(targetObject, config) {
	let holder;

	if (targetObject === undefined)
		return (null);
	if (config === undefined)
		config.name = 'undefined';
	this.boundHitboxes[config.name] = this.boundObjects[targetObject].addHitBox(config);
	return (this.boundHitboxes[config.name]);
}

PlayableCharacter.prototype.bindGamepad = function(gamepad) {
	this.boundGamePad = gamepad;
	if (gamepad !== undefined && gamepad !== null)
		gamepad.used = true;
	return (gamepad);
}

PlayableCharacter.prototype.swapAnimationState = function(state, targetObject, cb) {
	if (this.boundObjects[targetObject] !== undefined)
		this.boundObjects[targetObject].currentSate = state;
}

PlayableCharacter.prototype.appendAnimationToObjectQueue = function(context, stateName, callback) {
	if (this.boundObjects[context] === undefined)
		return (null);
	else
		return (this.boundObjects[context].addAnimationToQueue(stateName, callback));
}

PlayableCharacter.prototype.clearAnimationQueue = function(context) {
	if (this.boundObjects[context] !== undefined)
		this.boundObjects[context].animationQueue = [];
}

PlayableCharacter.prototype.removeHitbox = function(name) {
	if (this.boundHitboxes[name] !== undefined)
		this.boundHitboxes[name].delete = true;
}