/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   playerClass.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mgras <mgras@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/05/04 16:01:42 by mgras             #+#    #+#             */
/*   Updated: 2017/05/29 00:06:28 by mgras            ###   ########.fr       */
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
		return (null)
	if (config === undefined)
		config.name = 'undefined';
	boundHitboxes[config.name] = new HitBox(this, config);
	return (boundHitboxes[config.name]);
}

PlayableCharacter.prototype.bindGamepad = function(gamepad) {
	this.boundGamePad = gamepad;
	gamepad.used = true;
	return (gamepad);
}

PlayableCharacter.prototype.swapAnimationState = function(state, targetObject, cb) {
	this.boundObjects[targetObject].currentSate = state;
}