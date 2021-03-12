# Phaser FX - Warp Post FX

![Phaser FX logo](media/phaser-fx.png)

## How to setup the ESM (module) Post FX Pipeline

In the `dist` folder you will find an ESM (ES Module) version of the effect. You can import this into your ES6 code like any other _local_ module:

```js
import { WarpPostFX } from '../dist/WarpPostFX.js';
```

Note that the Post Pipeline modules we provide all use a named export, not a default export, so you import them using curly braces: `import { WarpPostFX } ...`. You can, of course, copy the pipeline file into your own project structure. The file does not have to remain in its `dist` folder.

Once imported, add the pipeline to your game config via the `pipeline` parameter:

```js
const config = {
    type: Phaser.WEBGL,
    scene: Example,
    pipeline: { WarpPostFX }
};

let game = new Phaser.Game(config);
```

The `pipeline` parameter is an object of key value pairs. As we're using ES6 we can take advantage of object destructuring and use the short-hand syntax: `{ WarpPostFX }`. You could also provide it like this `{ 'WarpPostFX': WarpPostFX }`.

The new Post FX Pipeline will be installed into Phaser during instantiation and then available from any Scene:

```js
const bg = this.add.image(...);

bg.setPostPipeline(WarpPostFX);
```

When setting a Post Pipeline you always pass in the class directly, not an instance of it:

```js
const bg = this.add.image(...);

bg.setPostPipeline(WarpPostFX); // ✔️ correct!
bg.setPostPipeline(WarpPostFX()); // ❌ wrong!
bg.setPostPipeline(new WarpPostFX()); // ❌ wrong!
```

Your pipeline is now ready for use!

The pipeline is available globally, from within any Scene in your game. This is because the Pipeline Manager is a global system belonging to the renderer, shared by all Scenes.

Please see the examples for further details about this specific effect.

## How to setup the ES5 Post FX Pipeline

As well as an ESM version, you will also find in the `dist` folder a version of the pipeline built specifically for older browsers that do not support modules. This build of the pipeline has `.es5.js` as the filename extension.

Add it into your html as you would a regular external JavaScript file:

```html
<script src="../dist/WarpPostFX.es5.js"></script>
```

You can, of course, copy the pipeline file into your own project structure. The file does not have to remain in the `dist` folder. Equally, you do not _have_ to use a `<script>` tag to load it. You could also use any popular bundler such as Webpack or Parcel.

Once imported, add the pipeline to your game config via the `pipeline` parameter:

```js
var config = {
    type: Phaser.WEBGL,
    scene: Example,
    pipeline: { 'WarpPostFX': FX.WarpPostFX }
};

var game = new Phaser.Game(config);
```

Note how the pipeline begins with `FX`. In this case, `FX.WarpPostFX`. This global namespace is used for all of the ES5 Post FX Pipelines we provide and is required when using ES5 versions.

The new Post FX Pipeline will be installed into Phaser during instantiation and then available from any Scene:

```js
var bg = this.add.image(...);

bg.setPostPipeline(FX.WarpPostFX);
```

Again, notice how we have to include `FX.` at the start of the pipeline name.

When setting a Post Pipeline you always pass in the class directly, not an instance of it:

```js
var bg = this.add.image(...);

bg.setPostPipeline(FX.WarpPostFX); // ✔️ correct!
bg.setPostPipeline(FX.WarpPostFX()); // ❌ wrong!
bg.setPostPipeline(new FX.WarpPostFX()); // ❌ wrong!
```

Your pipeline is now ready for use!

The pipeline is available globally, from within any Scene in your game. This is because the Pipeline Manager is a global system belonging to the renderer, shared by all Scenes.

Please see the examples for further details about this specific effect.

## How to add a Post FX Pipeline in a Scene

Although convenient, you do not have to specify all of your Post FX Pipelines in your game configuration. You can also add them directly to the Pipeline Manager from within a Scene.

The process of importing the module, or including the script tag, is exactly the same as before. However, you call the `addPostPipeline` method to add it:

```js
this.renderer.pipelines.addPostPipeline('WarpPostFX', WarpPostFX);
```

As with the game config, you should make sure you pass the base class to this method and not an instance:

```js
this.renderer.pipelines.addPostPipeline('WarpPostFX', WarpPostFX); // ✔️ correct!
this.renderer.pipelines.addPostPipeline('WarpPostFX', WarpPostFX()); // ❌ wrong!
this.renderer.pipelines.addPostPipeline('WarpPostFX', new WarpPostFX()); // ❌ wrong!
```

Remember, if you're using the ES5 version of the pipeline you must include `FX.` at the start:

```js
this.renderer.pipelines.addPostPipeline('WarpPostFX', FX.WarpPostFX);
```

You can call `addPostPipeline` at any point in your Scene, for example in `init`, `preload` or `create`. The choice is yours and it will work providing you add the pipeline _before_ you try to use it on a Game Object.

Once this call has been made, the pipeline is available globally, both within the current Scene and any other Scene in your game, even ones already running. This is because the Pipeline Manager is a global system belonging to the renderer, shared by all Scenes.

## How to use the Post FX Pipeline in TypeScript

The Warp Post FX is written in TypeScript and the source code can be found in the `src` folder. The easiest way to use it in a native TypeScript project is to copy the `src/WarpPostFX.ts` file into your project and use the following approach in your code:

First, import the pipeline:

```js
import { WarpPostFX } from './WarpPostFX';
```

Then, add it to the renderer. It's easier to do it this way than using the Game Config:

```js
const renderer = this.renderer as Phaser.Renderer.WebGL.WebGLRenderer;

renderer.pipelines.addPostPipeline('WarpPostFX', WarpPostFX);
```

You can now set the pipeline onto a Game Object:

```js
const pic1 = this.add.image(400, 300, 'pic1').setPostPipeline(WarpPostFX);
```

Remember, if you want to get the pipeline in order to access its properties or methods, you must cast it for TypeScript to recognise the type:

```js
const pipeline = pic1.getPostPipeline(WarpPostFX) as WarpPostFX;
```

This will give you full code-insight and documentation for properties and methods.

If you prefer, you can import the ES Module version instead and use the provided TypeScript Definitions. It's entirely up to you. However, the above approach is probably easier in terms of project setup.
