
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
class WarpPostFX extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
  constructor(game) {
    super({
      game,
      name: "WarpPostFX",
      fragShader
    });
    this.progress = 0;
    this.resizeMode = 1;
    this.toRatio = 0;
    this.smoothness = 0.5;
    this.direction = new Phaser.Math.Vector2(-1, 1);
  }
  onBoot() {
    this.setTexture();
  }
  setResizeMode(mode = 1) {
    this.resizeMode = mode;
    return this;
  }
  setTexture(texture = "__DEFAULT", resizeMode) {
    let phaserTexture = this.game.textures.getFrame(texture);
    if (!phaserTexture) {
      phaserTexture = this.game.textures.getFrame("__DEFAULT");
    }
    this.toRatio = phaserTexture.width / phaserTexture.height;
    this.targetTexture = phaserTexture.glTexture;
    if (resizeMode !== void 0) {
      this.resizeMode = resizeMode;
    }
    this.set1i("uMainSampler2", 1);
    this.set1f("toRatio", this.toRatio);
    return this;
  }
  setProgress(value = 0) {
    this.progress = Phaser.Math.Clamp(value, 0, 1);
    return this;
  }
  setSmoothness(value = 0.5) {
    this.smoothness = value;
    return this;
  }
  setDirection(x = -1, y = 1) {
    this.direction.set(x, y);
    return this;
  }
  onPreRender() {
    this.set1f("progress", this.progress);
    this.set1i("resizeMode", this.resizeMode);
    this.set1f("smoothness", this.smoothness);
    this.set2f("direction", this.direction.x, this.direction.y);
  }
  onDraw(renderTarget) {
    this.set1f("fromRatio", renderTarget.width / renderTarget.height);
    this.bindTexture(this.targetTexture, 1);
    this.bindAndDraw(renderTarget);
  }
}
export {
  WarpPostFX
};
