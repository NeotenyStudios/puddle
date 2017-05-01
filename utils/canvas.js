/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   canvas.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mgras <mgras@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/04/20 15:41:57 by mgras             #+#    #+#             */
/*   Updated: 2017/04/26 18:40:06 by mgras            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

let Canvas = function(name, config) {
	this.DOM = this.initCanvas(config.width, config.height);
	this.ctx = this.DOM.getContext('2d');
}

Canvas.prototype.initCanvas = function(w, h) {
	let canvasDOM;

	canvasDOM			= document.createElement('canvas');
	canvasDOM.width		= w || 1280;
	canvasDOM.height	= h || 720;
	$(canvasDOM).css({
		'border'	: '1px solid #000',
		'position'	: 'absolute',
		'top'		: '0',
		'left'		: '0'
	});
	document.body.appendChild(canvasDOM);
	return (canvasDOM);
}