/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   emulatedGamepadClass.js                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: anonymous <anonymous@student.42.fr>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/06/16 18:39:35 by anonymous         #+#    #+#             */
/*   Updated: 2017/06/16 19:20:43 by anonymous        ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

let defaultInerGamepedStructure = {
	pressed : false,
	value : 0
};


let pressedInerGamepadStructure = {
	pressed : true,
	value : 1
};

let EmulatedGamepad = function(engine) {
	let _this = this;

	if (engine === undefined)
		return (null);
	this.engine = engine;
	this.handler = null;
	this.moveStick = {
		xAxis : 0,
		yAxis : 0,
		click : defaultInerGamepedStructure,
		deadZone : 0
	};
	this.cStick = {
		xAxis : 0,
		yAxis : 0,
		click : defaultInerGamepedStructure,
		deadZone : 0
	};
	this.a = defaultInerGamepedStructure;
	this.b = defaultInerGamepedStructure;
	this.x = defaultInerGamepedStructure;
	this.y = defaultInerGamepedStructure;
	this.start = defaultInerGamepedStructure;
	this.select = defaultInerGamepedStructure;
	this.arrows = {
		left	: defaultInerGamepedStructure,
		right	: defaultInerGamepedStructure,
		up		: defaultInerGamepedStructure,
		down	: defaultInerGamepedStructure
	};
	this.triggers = {
		topLeft		: defaultInerGamepedStructure,
		botLeft		: defaultInerGamepedStructure,
		topRight	: defaultInerGamepedStructure,
		botRight	: defaultInerGamepedStructure
	};
	this.handle = function(){};
	this.states = {};
	this.readyEvent = new CustomEvent('gamepadReady', {'detail' : _this});
	this.used = false;
	this.user = null;
	this.disconnecting = false;
	$(window).keydown((e) => {
		const key = e.keyCode;

		if (key === 38)
			_this.moveStick.yAxis = 1;
		else if (key === 40)
			_this.moveStick.yAxis = -1;
		if (key === 37)
			_this.moveStick.xAxis = -1;
		else if (key === 39)
			_this.moveStick.xAxis = 1;
		if (key === 32)
			_this.x = pressedInerGamepadStructure;
	}).bind(_this);

	$(window).keyup((e) => {
		const key = e.keyCode;

		if (key === 38)
			_this.moveStick.yAxis = 0;
		else if (key === 40)
			_this.moveStick.yAxis = 0;
		if (key === 37)
			_this.moveStick.xAxis = 0;
		else if (key === 39)
			_this.moveStick.xAxis = 0;
		if (key === 32)
			_this.x = defaultInerGamepedStructure;
	}).bind(_this);
}

EmulatedGamepad.prototype.update = function() {
	if (this.handle !== null)
		this.handle();
}

EmulatedGamepad.prototype.setHandler = function(handler, boundObject) {
	let _this = this;

	this.handler = handler;
	this.handle = function() {
		handler(_this, boundObject);
	}.bind(_this, boundObject);
}