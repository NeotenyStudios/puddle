# The puddle engine
Hi, my name is NowL and welcome to the *puddle engine's* **github repository**
*clapping intensifies*

## What is the puddle engine ?
Well it's pretty simple. Puddle is Neoteny Studios first engine.
Crafted with care, it's a vanilla JS engine designed to support **2d multiplayer games**.
Or at least that's what **I strive to do**.
Also I am aware that it's a complete mess on the optimisation side of things

## When should it be finished ?
Well there is not really an end to this project since I'm pretty sure even tho it works there is still much more to optimize and adjust

# What do to make work ?
In the grand scheme of things the puddle engine is just a complex loop of instructions. First things first, we need to initialize an engine instance.

```Javascript
const engine = new Awakening({'width' : 1920, 'height': 1080});
```

Great. The loop is looping. The wheel is turning.
Notice you can pass a config object to awakening here's all the stuff you can initialize :
```Javascript
{
	'height'      : Number, //height of the canvas, 0 by default
	'width'       : Number, //width of the canvas, 0 by default
	'dsplFR'      : Boolean, //display fps, true by default
	'dsplOC'      : Boolean, //display object count, true by default
	'dsplFR'      : Boolean, //display Hitbox trigger count, true by default
	'logicStart'  : Function(engineInstance), //pre logic instructions
	'logicend'    : Function(engineInstance), //post logic instructions
	'drawStart'   : Function(engineInstance), //pre drawing instructions
	'drawEnd'     : Function(engineInstance), //prost drawing instructions
	'onLoopStart' : Function(engineInstance), //pre everything instructions
	'onLoopEnd'   : Function(engineInstance), //post everything instructions
}
```
**In this case** *engineInstance* **refers to it's self**
*Note that this part may change alot while I work on it, for instance, I want to ditch the width and height properties to replace them with a screen ratio.*


## 1. Engine instance
Here's all you can do with your engine instance

### 1.a .verifGamePad(gamepad)
This function takes a *gamepadObject*
It will return null if it's not valid, on the flipside it will just pass the *gamepadObject* back if it's valid.

### 1.b .getAvailableGamePad( )
Returns an available gamepad

### 1.c .addCustomGamepadToLoop( )
This function is mainly here for testing. But you can also use it for other things.
It will add an *EmulatedGamepadObject* to the logic loop

### 1.d .searchForGamePads( )
Will try to assign as many available gamepads to the Engine's gamepad array. Once it finished initializing a gamepad it'll trigger the custom readyEvent for this gamepad

### 1.e .calculateLogic(progress)
This is the function responsible for all the logic instructions.
First it will reset all the **hitbox collide markers** to *false*.
Secondly we'll loop in all liveObjects and update all hitboxes and rigidbody positions.
Then we summon satan and resolve all hitbox handlers and rigidbody collisions.
You should never be in the need to call this function anyways, the engine loops on it's own.
But you never know, maybe you want to calculate the next logic tick because you can.
Note that the engines logicStart and logicEnd are executed at the begining and the end of this function.

### 1.f .drawCameraTranslation(layer)
Takes a layer as input and will adjust it's position and zoom factor according to the camera values of the Engine Instance. All layer share the same camera.

### 1.g .draw(progress)
This function handles all the drawing. 
It's responsible or all the animation progess and pacing.
First it will adjust all layers to the camera translation factor of it's instance.
Then will proceed to loop in all objects too draw them if needed.
Last but not least, it will display fps, objCount and registeredHitCount values if asked.

### 1.h .moveCamera(x, y, z)
Moves the camera.
X is left right.
Y is top down.
Z is zoom.

### 1.i .setZoom(z)
Sets the camera Zoom to the supplied value

### 1.j .loop(timestamp)
This is the main loop, it's mainly here to call .draw(), and .calculateLogic(), it'll also set some usefull pacing values like the elapsedTime and lastRender values. like .draw() and .calculateLogic(), you should never need to call this.

### 1.k .clearCanvas()
Clears *all* layers from this engine instance.

### 1.l .forwardAnimationStates()
This should in theory never be called, it's here to forward all animations to their next frame based on the elapsed time since last render.

### 1.m .buildObject()
Shortcut to build a new Object and assign it to the engine instance. See gameObject for configurations details
