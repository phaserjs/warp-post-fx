import Phaser from 'phaser';
export declare class WarpPostFX extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
    progress: number;
    targetTexture: WebGLTexture;
    resizeMode: number;
    toRatio: number;
    smoothness: number;
    direction: Phaser.Math.Vector2;
    constructor(game: Phaser.Game);
    onBoot(): void;
    setResizeMode(mode?: number): this;
    setTexture(texture?: string, resizeMode?: number): this;
    setProgress(value?: number): this;
    setSmoothness(value?: number): this;
    setDirection(x?: number, y?: number): this;
    onPreRender(): void;
    onDraw(renderTarget: Phaser.Renderer.WebGL.RenderTarget): void;
}
//# sourceMappingURL=WarpPostFX.d.ts.map