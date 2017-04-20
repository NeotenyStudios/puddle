/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   vectorClass.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mgras <mgras@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/04/18 13:18:39 by mgras             #+#    #+#             */
/*   Updated: 2017/04/20 12:31:51 by mgras            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

let Vector = function(config) {
	if (!config)
		config = {};
	this.x = config.x || 0;
	this.y = config.y || 0;
}

Vector.prototype.dotProduct = function(v) {
	return(this.x * v.x + this.y * v.y);
}

Vector.prototype.crossProduct = function(v) {
	return(this.x * v.x - this.y * v.y);
}

Vector.prototype.add = function(v) {
	return (new Vector({x : this.x + v.x, y : this.y + v.y}));
}

Vector.prototype.sub = function(v) {
	const nV = {
		x : -v.x,
		y : -v.y
	}
	return (this.add(nV));
}

Vector.prototype.mult = function(scalar) {
	return (new Vector({x : this.x * scalar, y : this.y * scalar}));
}

Vector.prototype.perp = function() {
	return (new Vector({x : this.x, y : -this.y}));
}

Vector.prototype.getLength = function() {
	return Math.sqrt((this.x * this.x) + (this.y * this.y));
}

Vector.prototype.getAngle = function() {
	return Math.atan2(this.y, this.x);
}

Vector.prototype.setAngle = function(value) {
	const len = this.getLength();

	this.x = Math.cos(value) * len;
	this.y = Math.sin(value) * len;
};

Vector.prototype.clone = function() {
	return (new Vector({x : this.x, y : this.y}));
}

Vector.prototype.normalize = function() {
	const length = this.getLength();

	return (new Vector({x : this.x / length, y : this.y / length}));
}

Vector.prototype.set = function(x, y) {
	this.x = x;
	this.y = y;
}