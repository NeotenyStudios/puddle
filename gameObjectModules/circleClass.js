/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   circleClass.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mgras <mgras@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/04/18 13:36:28 by mgras             #+#    #+#             */
/*   Updated: 2017/04/18 13:45:19 by mgras            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

let Circle = function(config) {
	this.radius = config.radius || 0;
	this.position = new Vector({
		x : config.x || 0,
		y : config.y || 0
	});
}

Circle.prototype.distance = function(b) {
	return (Math.sqrt(Math.pow(this.x - b.x, 2) + Math.pow(this.y - b.y, 2)));
}

Circle.prototype.cmpCircle = function(b) {
	let r = this.radius + b.radius;

	r *= r;
	return (r < Math.pow(this.x + b.x, 2) + Math.pow(this.y + b.y, 2));
}