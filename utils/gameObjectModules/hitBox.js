/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   hitBox.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mgras <mgras@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/04/17 17:12:14 by mgras             #+#    #+#             */
/*   Updated: 2017/04/17 17:44:10 by mgras            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

let	HitBox = function (parentGameObject, config) {
	if (!parentGameObject) {
		console.error('noParentGameObject bounded to the HitBox module');
		return (null);
	}
	config = config !== undefined ? config : {};
	this.position = {
		x : parentGameObject.position.x,
		y : parentGameObject.position.y
	}
	this.width = parentGameObject.size.x || 0;
	this.height = parentGameObject.size.y || 0;
	this.name = config.name + '__' + parentGameObject.name;
	this.offset = {
		x : config.offsetX || 0,
		y : config.offsetY || 0
	}
	this.handler = config.handler || null;
	this.type = config.type || 'default';
	this.parentGameObject = parentGameObject;
}