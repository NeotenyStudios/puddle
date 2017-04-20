/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   canvas.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mgras <mgras@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/04/03 18:42:07 by mgras             #+#    #+#             */
/*   Updated: 2017/04/16 14:21:52 by mgras            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

let initCanvas = function (w, h) {
	let canvasDOM;

	canvasDOM			= document.getElementById('mainFrame');
	canvasDOM.width		= w || 1280;
	canvasDOM.height	= h || 720;
	return (canvasDOM);
}