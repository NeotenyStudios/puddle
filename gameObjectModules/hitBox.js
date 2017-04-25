/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   hitBox.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mgras <mgras@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/04/17 17:12:14 by mgras             #+#    #+#             */
/*   Updated: 2017/04/24 14:57:43 by mgras            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

let	HitBox = function (parentGameObject, config) {
	if (parentGameObject === undefined || parentGameObject === null)
	{
		console.warn('No parentGameObject');
		return (null)
	}
	this.handler = null
	this.parentGameObject = parentGameObject;
}
