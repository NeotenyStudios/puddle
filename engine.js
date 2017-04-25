/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   engine.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mgras <mgras@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/04/03 15:30:32 by mgras             #+#    #+#             */
/*   Updated: 2017/04/25 18:55:22 by mgras            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

//player.addAnimationState('default', ['/0.png', '/1.png', '/2.png', '/3.png', '/4.png', '/5.png', '/6.png', '/7.png']);

let awakening;

$(document).ready(() => {
	awakening = new Awakening({
		'width' : 1920,
		'height': 1080,
	});

	setInterval(() => {
		awakening.lastRenderedFrames = awakening.renderedFrames;
		awakening.renderedFrames = 0;
		awakening.elapsedTime = 0;
		awakening.canvas.fillText(awakening.renderedFrames, 10 , 10);
	}, 1000);

	let blockL = 0;
	let blockX = 0;
	let blockR = 0;

	awakening.buildObject('bottomBlock', {'engine' : this});
	awakening.buildObject('topBlock', {'engine' : this});
	awakening.buildObject('leftBlock', {'engine' : this});
	awakening.buildObject('rightBlock', {'engine' : this});

	setInterval(() => {
		if (awakening.objNb < 50)
		{
			awakening.buildObject('blockL' + blockL, {'engine' : this});
			rest = awakening.objects['blockL' + blockL];
			blockL++;
			rest.move(40, 455);
			rest.setSize(100, 100);
			rest.addRigidBody();
			rest.setSpeed(gMM(10, 5), 5);
		}
	}, 500);

	setInterval(() => {
		if (awakening.objNb < 50)
		{
			awakening.buildObject('blockX' + blockX, {'engine' : this});
			rest = awakening.objects['blockX' + blockX];
			blockX++;
			rest.move(1500, 450);
			rest.setSize(75, 75);
			rest.addRigidBody();
			rest.rigidBody.setMass(100);
			rest.setSpeed(gMM(-10, 5), 5);
		}
	}, 250);

	window.requestAnimationFrame((timestamp) => {awakening.loop(timestamp)});
});

function gMM(min, max) {
	return (Math.floor(Math.random() * max) + min)
}