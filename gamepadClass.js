/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   gamepadClass.js                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mgras <mgras@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/05/01 15:34:14 by mgras             #+#    #+#             */
/*   Updated: 2017/08/31 11:03:59 by mgras            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

'use strict';

let Gamepad = function(gamepadOrder, engine) {
	let _this = this;

	if (engine === undefined)
		return (null);
	this.engine = engine;
	this.position = gamepadOrder || 0;
	this.pad = (navigator.getGamepads())[gamepadOrder];
	this.moveStick = {
		xAxis : this.pad.axes[0],
		yAxis : this.pad.axes[1],
		click : this.pad.buttons[10],
		deadZone : 0.4
	};
	this.cStick = {
		xAxis : this.pad.axes[2],
		yAxis : this.pad.axes[3],
		click : this.pad.buttons[11],
		deadZone : 0.4
	};
	this.a = this.pad.buttons[1];
	this.b = this.pad.buttons[0];
	this.x = this.pad.buttons[2];
	this.y = this.pad.buttons[3];
	this.start = this.pad.buttons[9];
	this.select = this.pad.buttons[8];
	this.arrows = {
		left	: this.pad.buttons[14],
		right	: this.pad.buttons[15],
		up		: this.pad.buttons[12],
		down	: this.pad.buttons[13]
	};
	this.triggers = {
		topLeft		: this.pad.buttons[4],
		botLeft		: this.pad.buttons[6],
		topRight	: this.pad.buttons[5],
		botRight	: this.pad.buttons[7]
	};
	this.handle = function(){};
	this.states = {};
	this.readyEvent = new CustomEvent('gamepadReady', {'detail' : _this});
	this.used = false;
	this.user = null;
	this.disconnecting = false;
}

Gamepad.prototype.update = function() {
	this.pad = (navigator.getGamepads())[this.position];
	this.moveStick = {
		xAxis : this.pad.axes[0],
		yAxis : this.pad.axes[1],
		click : this.pad.buttons[10],
		deadZone : 0.2
	};
	this.cStick = {
		xAxis : this.pad.axes[2],
		yAxis : this.pad.axes[3],
		click : this.pad.buttons[11],
		deadZone : 0.2
	};
	this.a = this.pad.buttons[1];
	this.b = this.pad.buttons[0];
	this.x = this.pad.buttons[2];
	this.y = this.pad.buttons[3];
	this.start = this.pad.buttons[9];
	this.select = this.pad.buttons[8];
	this.arrows = {
		left	: this.pad.buttons[14],
		right	: this.pad.buttons[15],
		up		: this.pad.buttons[12],
		down	: this.pad.buttons[13]
	};
	this.triggers = {
		topLeft		: this.pad.buttons[4],
		botLeft		: this.pad.buttons[6],
		topRight	: this.pad.buttons[5],
		botRight	: this.pad.buttons[7]
	};
	if (this.handle !== null)
		this.handle();
}

Gamepad.prototype.setHandler = function(handler, boundObject) {
	let _this = this;

	this.handle = function() {
		handler(_this, boundObject);
	}.bind(_this, boundObject);
}