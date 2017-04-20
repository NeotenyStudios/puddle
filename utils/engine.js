/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   engine.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mgras <mgras@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/04/03 15:30:32 by mgras             #+#    #+#             */
/*   Updated: 2017/04/20 15:18:00 by mgras            ###   ########.fr       */
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
		if (awakening.objNb < 250)
		{
			awakening.buildObject('blockL' + blockL, {'engine' : this});
			rest = awakening.objects['blockL' + blockL];
			blockL++;
			rest.move(40, 455);
			rest.setSize(gMM(20, 25), gMM(20, 25));
			rest.addRigidBody();
			rest.setSpeed(gMM(10, 5), 2);
		}
	}, 250);

	setInterval(() => {
		if (awakening.objNb < 250)
		{
			awakening.buildObject('blockX' + blockX, {'engine' : this});
			rest = awakening.objects['blockX' + blockX];
			blockX++;
			rest.move(1500, 450);
			rest.setSize(gMM(20, 25), gMM(20, 25));
			rest.addRigidBody();
			rest.setSpeed(gMM(-10, 5), 2);
		}
	}, 250);

	let bottomBlock = awakening.objects.bottomBlock;
	bottomBlock.move(0, 1000);
	bottomBlock.setSize(1920, 50);
	bottomBlock.addRigidBody();
	bottomBlock.rigidBody.setMass(0);

	let topBlock = awakening.objects.topBlock;
	topBlock.move(0, 50);
	topBlock.setSize(1920, 50);
	topBlock.addRigidBody();
	topBlock.rigidBody.setMass(0);

	let leftBlock = awakening.objects.leftBlock;
	leftBlock.move(0, 101);
	leftBlock.setSize(50, 890);
	leftBlock.addRigidBody();
	leftBlock.rigidBody.setMass(0);

	let rightBlock = awakening.objects.rightBlock;
	rightBlock.move(1800, 101);
	rightBlock.setSize(50, 890);
	rightBlock.addRigidBody();
	rightBlock.rigidBody.setMass(0);

	window.requestAnimationFrame((timestamp) => {awakening.loop(timestamp)});
});

function gMM(min, max) {
	return (Math.floor(Math.random() * max) + min)
}