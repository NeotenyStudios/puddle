/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   engine.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mgras <mgras@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/04/03 15:30:32 by mgras             #+#    #+#             */
/*   Updated: 2017/05/01 20:16:03 by mgras            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

//player.addAnimationState('default', ['/0.png', '/1.png', '/2.png', '/3.png', '/4.png', '/5.png', '/6.png', '/7.png']);

let awakening;
let start = true;
let score = 0;
let hScore = 0;

$(document).ready(() => {
	awakening = new Awakening({
		'width' : 1920,
		'height': 1080,
	});

	setInterval(() => {
		awakening.lastRenderedFrames = awakening.renderedFrames;
		awakening.renderedFrames = 0;
		awakening.elapsedTime = 0;
		awakening.layers.debug.ctx.fillText(awakening.renderedFrames, 10 , 10);
	}, 1000);

	let blockL = 0;
	let blockX = 0;
	let blockR = 0;

	// awakening.buildObject('bottomBlock');
	// awakening.buildObject('topBlock');
	// awakening.buildObject('leftBlock');
	// awakening.buildObject('rightBlock');

	// setInterval(() => {
		if (awakening.objNb < 50 && start === true)
		{
			awakening.buildObject('blockL' + blockL);
			rest = awakening.objects['blockL' + blockL];
			blockL++;
			rest.move(gMM(40, 1000), 150);
			rest.setSize(100, 100);
			rest.addRigidBody();
			rest.toggleGravity();
			window.addEventListener('gamepadReady', function(e) {
				awakening.controlers[e.detail.position].setHandler(function(_this) {
					_this.engine.objects['blockL0'].setSpeed(
						Math.abs(_this.engine.controlers[0].moveStick.xAxis) > _this.engine.controlers[0].moveStick.deadZone ? _this.engine.controlers[0].moveStick.xAxis * 20 : 0,
						_this.engine.objects['blockL0'].rigidBody.velocity.y
					);
					if (_this.engine.objects['blockL0'].rigidBody.collide.bot === true)
						_this.states.jumped = false;
					if (_this.a.pressed === true && _this.states.jumped === false)
					{
						_this.states.jumped = true;
						_this.engine.objects['blockL0'].setSpeed(_this.engine.objects['blockL0'].rigidBody.velocity.x, -15);
					}
					if (_this.engine.objects['blockL0'].position.y > 878)
						score = 0;
					else
						score += Math.abs(878 - _this.engine.objects['blockL0'].position.y) / 100;
					if (score > hScore)
						hScore = score;
				});
			});
		}
	// }, 250);

	setInterval(() => {
		if (awakening.objNb < 10 && start === true)
		{
			awakening.buildObject('blockR' + blockR);
			rest = awakening.objects['blockR' + blockR];
			blockR++;
			rest.move(gMM(40, 1000), 150);
			rest.setSize(gMM(25, 50), gMM(100, 150));
			rest.addRigidBody();
			rest.rigidBody.setMass(100);
			rest.setSpeed(gMM(-2, -1), 2);
			rest.rigidBody.setBounce(1);
			//rest.toggleGravity();
		}
	}, 250);

	awakening.buildObject('blockX' + blockX);
	hb = awakening.objects['blockX' + blockX];
	blockX++;
	hb.move(0, 1000);
	hb.setSize(1920, 100);
	hb.addRigidBody()
	hb.setMass(0);
	hb.addHitBox();

	window.requestAnimationFrame((timestamp) => {awakening.loop(timestamp)});
});

function gMM(min, max) {
	return (Math.floor(Math.random() * max) + min)
}