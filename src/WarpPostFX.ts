/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       pschroen
 * @copyright    2021 Photon Storm Ltd.
 */

import Phaser from 'phaser';

const fragShader = `
#define SHADER_NAME WARP_FS

precision mediump float;

uniform sampler2D uMainSampler;
uniform sampler2D uMainSampler2;

uniform int resizeMode;
uniform float progress;
uniform float fromRatio;
uniform float toRatio;

varying vec2 outFragCoord;

//  Transition specific
uniform vec2 direction;
uniform float smoothness;

const vec2 center = vec2(0.5, 0.5);

vec4 getFromColor (vec2 uv)
{
    return texture2D(uMainSampler, uv);
}

vec4 getToColor (vec2 uv)
{
    if (resizeMode == 2)
    {
        //  cover
        return texture2D(uMainSampler2, 0.5 + (vec2(uv.x, 1.0 - uv.y) - 0.5) * vec2(min(fromRatio / toRatio, 1.0), min((toRatio / fromRatio), 1.0)));
    }
    else if (resizeMode == 1)
    {
        //  contain
        return texture2D(uMainSampler2, 0.5 + (vec2(uv.x, 1.0 - uv.y) - 0.5) * vec2(max(fromRatio / toRatio, 1.0), max((toRatio / fromRatio), 1.0)));
    }
    else
    {
        //  stretch
        return texture2D(uMainSampler2, vec2(uv.x, 1.0 - uv.y));
    }
}

// Transition Author: pschroen
// Transition License: MIT

vec4 transition (vec2 uv)
{
    vec2 v = normalize(direction);

    v /= abs(v.x) + abs(v.y);

    float d = v.x * center.x + v.y * center.y;
    float m = 1.0 - smoothstep(-smoothness, 0.0, v.x * uv.x + v.y * uv.y - (d - 0.5 + progress * (1.0 + smoothness)));

    return mix(getFromColor((uv - 0.5) * (1.0 - m) + 0.5), getToColor((uv - 0.5) * m + 0.5), m);
}
    
void main ()
{
    vec2 uv = outFragCoord;

    gl_FragColor = transition(uv);
}
`;

export class WarpPostFX extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline
{
    /**
     * The progress of the transition effect. From 0 to 1.
     *
     * @type {number}
     * @memberof WarpPostFX
     */
    progress: number;

    /**
     * The WebGL Texture being transitioned to.
     *
     * @type {WebGLTexture}
     * @memberof WarpPostFX
     */
    targetTexture: WebGLTexture;

    /**
     * The resize mode to be used for the target texture.
     * 
     * Can be either 0, 1 or 2, for stretch, contain and cover modes respectively.
     * 
     * The default is 'contain'.
     * 
     * Set via the `setResizeMode` method.
     *
     * @type {number}
     * @memberof WarpPostFX
     */
    resizeMode: number;

    /**
     * The ratio of the target texture (width / height).
     * 
     * This is set automatically in the `setTexture` method.
     *
     * @type {number}
     * @memberof WarpPostFX
     */
    toRatio: number;

    /**
     * The smoothness of the effect.
     * 
     * @type {number}
     * @memberof WarpPostFX
     */
    smoothness: number;

    /**
     * The direction of the effect.
     * 
     * @type {Phaser.Math.Vector2}
     * @memberof WarpPostFX
     */
    direction: Phaser.Math.Vector2;

    /**
     * The Warp Post FX is an effect that allows you to transition
     * between two objects via an effect that looks like a distortion
     * warp. You can control the smoothness and direction of the warp.
     * 
     * The source image comes from the Game Object to which the FX is applied,
     * which can be any Game Object that supports post pipelines, such as a
     * Sprite, Rope or Layer. You can also transition Cameras and even entire
     * Scenes. Please see the examples and class docs for further details.
     * 
     * @param {Phaser.Game} game
     * @memberof WarpPostFX
     */
    constructor (game: Phaser.Game)
    {
        super({
            game,
            name: 'WarpPostFX',
            fragShader
        });

        this.progress = 0;
        this.resizeMode = 1;
        this.toRatio = 0;

        this.smoothness = 0.5;
        this.direction = new Phaser.Math.Vector2(-1, 1);
    }

    /**
     * @ignore
     */
    onBoot (): void
    {
        this.setTexture();
    }

    /**
     * Set the resize mode of the target texture.
     * 
     * Can be either:
     * 
     * 0 - Stretch. The target texture is stretched to the size of the source texture.
     * 1 - Contain. The target texture is resized to fit the source texture. This is the default.
     * 2 - Cover. The target texture is resized to cover the source texture.
     * 
     * If the source and target textures are the same size, then use a resize mode of zero
     * for speed.
     *
     * @param {number} [mode=1] - The Resize Mode. Either 0, 1 or 2.
     * @returns {this}
     * @memberof WarpPostFX
     */
    setResizeMode (mode: number = 1): this
    {
        this.resizeMode = mode;

        return this;
    }

    /**
     * Set the texture to be transitioned to.
     * 
     * The texture must be already loaded and available from the Texture Manager.
     * 
     * You can optionally also set the resize mode. This can be either:
     * 
     * 0 - Stretch. The target texture is stretched to the size of the source texture.
     * 1 - Contain. The target texture is resized to fit the source texture. This is the default.
     * 2 - Cover. The target texture is resized to cover the source texture.
     * 
     * If the source and target textures are the same size, then use a resize mode of zero
     * for speed.
     *
     * @param {string} [texture='__DEFAULT'] - The key of the texture to use.
     * @param {number} [mode] - The Resize Mode. Either 0, 1 or 2.
     * @returns {this}
     * @memberof WarpPostFX
     */
    setTexture (texture: string = '__DEFAULT', resizeMode?: number): this
    {
        let phaserTexture = this.game.textures.getFrame(texture);

        if (!phaserTexture)
        {
            phaserTexture = this.game.textures.getFrame('__DEFAULT');
        }

        this.toRatio = phaserTexture.width / phaserTexture.height;

        this.targetTexture = phaserTexture.glTexture;

        if (resizeMode !== undefined)
        {
            this.resizeMode = resizeMode;
        }

        this.set1i('uMainSampler2', 1);
        this.set1f('toRatio', this.toRatio);

        return this;
    }

    /**
     * Sets the progress of this effect.
     * 
     * Progress is given as a value between 0 and 1.
     * 
     * You can call this method at any point, or modify the `progress` property
     * directly for the same result. This can be done via tweens, Scene transitions,
     * Loader progress updates or any other system.
     *
     * @param {number} [value=0] - The progress of the effect. A value between 0 and 1.
     * @returns {this}
     * @memberof WarpPostFX
     */
    setProgress (value: number = 0): this
    {
        this.progress = Phaser.Math.Clamp(value, 0, 1);

        return this;
    }

    /**
     * Sets the smoothness of the Warp effect.
     * 
     * @param {number} [value=0.5] - The smoothness.
     * @returns {this}
     * @memberof WarpPostFX
     */
    setSmoothness (value: number = 0.5): this
    {
        this.smoothness = value;

        return this;
    }

    /**
     * Sets the direction of the Warp effect.
     * 
     * @param {number} [x=-1] - The x direction.
     * @param {number} [y=1] - The y direction.
     * @returns {this}
     * @memberof WarpPostFX
     */
    setDirection (x: number = -1, y: number = 1): this
    {
        this.direction.set(x, y);

        return this;
    }

    /**
     * @ignore
     */
    onPreRender (): void
    {
        this.set1f('progress', this.progress);
        this.set1i('resizeMode', this.resizeMode);
        this.set1f('smoothness', this.smoothness);
        this.set2f('direction', this.direction.x, this.direction.y);
    }

    /**
     * @ignore
     */
    onDraw (renderTarget: Phaser.Renderer.WebGL.RenderTarget): void
    {
        this.set1f('fromRatio', renderTarget.width / renderTarget.height);

        this.bindTexture(this.targetTexture, 1);

        this.bindAndDraw(renderTarget);
    }
}
