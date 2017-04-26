/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   engine.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mgras <mgras@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/04/03 15:30:32 by mgras             #+#    #+#             */
/*   Updated: 2017/04/26 16:10:04 by mgras            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

//player.addAnimationState('default', ['/0.png', '/1.png', '/2.png', '/3.png', '/4.png', '/5.png', '/6.png', '/7.png']);

let awakening;
let start = true;

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

	// awakening.buildObject('bottomBlock', {'engine' : this});
	// awakening.buildObject('topBlock', {'engine' : this});
	// awakening.buildObject('leftBlock', {'engine' : this});
	// awakening.buildObject('rightBlock', {'engine' : this});

	setInterval(() => {
		if (awakening.objNb < 150 && start === true)
		{
			awakening.buildObject('blockL' + blockL, {'engine' : this});
			rest = awakening.objects['blockL' + blockL];
			blockL++;
			rest.move(40, 455);
			rest.setSize(gMM(50, 100), 100);
			rest.addHitBox({});
			rest.addRigidBody();
			rest.setSpeed(gMM(10, 5), 5);
		}
	}, 250);

	setInterval(() => {
		if (awakening.objNb < 150 && start === true)
		{
			awakening.buildObject('blockR' + blockR, {'engine' : this});
			rest = awakening.objects['blockR' + blockR];
			blockR++;
			rest.move(1500, 450);
			rest.setSize(gMM(50, 100), 75);
			rest.addHitBox({});
			rest.addRigidBody();
			rest.rigidBody.setMass(100);
			rest.setSpeed(gMM(-10, 5), 5);
		}
	}, 250);

	awakening.buildObject('blockX' + blockX, {'engine' : this});
	hb = awakening.objects['blockX' + blockX];
	blockX++;
	hb.move(0, 100);
	hb.setSize(1920, 100);
	hb.addHitBox({});

	window.requestAnimationFrame((timestamp) => {awakening.loop(timestamp)});
});

function gMM(min, max) {
	return (Math.floor(Math.random() * max) + min)
}