var FX = (function (exports, Phaser) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var Phaser__default = /*#__PURE__*/_interopDefaultLegacy(Phaser);

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var fragShader = "\n#define SHADER_NAME WARP_FS\n\nprecision mediump float;\n\nuniform sampler2D uMainSampler;\nuniform sampler2D uMainSampler2;\n\nuniform int resizeMode;\nuniform float progress;\nuniform float fromRatio;\nuniform float toRatio;\n\nvarying vec2 outFragCoord;\n\n//  Transition specific\nuniform vec2 direction;\nuniform float smoothness;\n\nconst vec2 center = vec2(0.5, 0.5);\n\nvec4 getFromColor (vec2 uv)\n{\n    return texture2D(uMainSampler, uv);\n}\n\nvec4 getToColor (vec2 uv)\n{\n    if (resizeMode == 2)\n    {\n        //  cover\n        return texture2D(uMainSampler2, 0.5 + (vec2(uv.x, 1.0 - uv.y) - 0.5) * vec2(min(fromRatio / toRatio, 1.0), min((toRatio / fromRatio), 1.0)));\n    }\n    else if (resizeMode == 1)\n    {\n        //  contain\n        return texture2D(uMainSampler2, 0.5 + (vec2(uv.x, 1.0 - uv.y) - 0.5) * vec2(max(fromRatio / toRatio, 1.0), max((toRatio / fromRatio), 1.0)));\n    }\n    else\n    {\n        //  stretch\n        return texture2D(uMainSampler2, vec2(uv.x, 1.0 - uv.y));\n    }\n}\n\n// Transition Author: pschroen\n// Transition License: MIT\n\nvec4 transition (vec2 uv)\n{\n    vec2 v = normalize(direction);\n\n    v /= abs(v.x) + abs(v.y);\n\n    float d = v.x * center.x + v.y * center.y;\n    float m = 1.0 - smoothstep(-smoothness, 0.0, v.x * uv.x + v.y * uv.y - (d - 0.5 + progress * (1.0 + smoothness)));\n\n    return mix(getFromColor((uv - 0.5) * (1.0 - m) + 0.5), getToColor((uv - 0.5) * m + 0.5), m);\n}\n    \nvoid main ()\n{\n    vec2 uv = outFragCoord;\n\n    gl_FragColor = transition(uv);\n}\n";
    var WarpPostFX = (function (_super) {
        __extends(WarpPostFX, _super);
        function WarpPostFX(game) {
            var _this = _super.call(this, {
                game: game,
                name: 'WarpPostFX',
                fragShader: fragShader
            }) || this;
            _this.progress = 0;
            _this.resizeMode = 1;
            _this.toRatio = 0;
            _this.smoothness = 0.5;
            _this.direction = new Phaser__default['default'].Math.Vector2(-1, 1);
            return _this;
        }
        WarpPostFX.prototype.onBoot = function () {
            this.setTexture();
        };
        WarpPostFX.prototype.setResizeMode = function (mode) {
            if (mode === void 0) { mode = 1; }
            this.resizeMode = mode;
            return this;
        };
        WarpPostFX.prototype.setTexture = function (texture, resizeMode) {
            if (texture === void 0) { texture = '__DEFAULT'; }
            var phaserTexture = this.game.textures.getFrame(texture);
            if (!phaserTexture) {
                phaserTexture = this.game.textures.getFrame('__DEFAULT');
            }
            this.toRatio = phaserTexture.width / phaserTexture.height;
            this.targetTexture = phaserTexture.glTexture;
            if (resizeMode !== undefined) {
                this.resizeMode = resizeMode;
            }
            this.set1i('uMainSampler2', 1);
            this.set1f('toRatio', this.toRatio);
            return this;
        };
        WarpPostFX.prototype.setProgress = function (value) {
            if (value === void 0) { value = 0; }
            this.progress = Phaser__default['default'].Math.Clamp(value, 0, 1);
            return this;
        };
        WarpPostFX.prototype.setSmoothness = function (value) {
            if (value === void 0) { value = 0.5; }
            this.smoothness = value;
            return this;
        };
        WarpPostFX.prototype.setDirection = function (x, y) {
            if (x === void 0) { x = -1; }
            if (y === void 0) { y = 1; }
            this.direction.set(x, y);
            return this;
        };
        WarpPostFX.prototype.onPreRender = function () {
            this.set1f('progress', this.progress);
            this.set1i('resizeMode', this.resizeMode);
            this.set1f('smoothness', this.smoothness);
            this.set2f('direction', this.direction.x, this.direction.y);
        };
        WarpPostFX.prototype.onDraw = function (renderTarget) {
            this.set1f('fromRatio', renderTarget.width / renderTarget.height);
            this.bindTexture(this.targetTexture, 1);
            this.bindAndDraw(renderTarget);
        };
        return WarpPostFX;
    }(Phaser__default['default'].Renderer.WebGL.Pipelines.PostFXPipeline));

    exports.WarpPostFX = WarpPostFX;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

}({}, Phaser));
