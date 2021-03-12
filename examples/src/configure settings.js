import { WarpPostFX } from '../../dist/WarpPostFX.js';

class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('pic1', 'assets/aliens.jpg');
        this.load.image('pic2', 'assets/warcraft.jpg');
    }

    create ()
    {
        const pic1 = this.add.image(400, 300, 'pic1').setPostPipeline(WarpPostFX);

        const pipeline = pic1.getPostPipeline(WarpPostFX);

        pipeline.setTexture('pic2', 0);

        const pane = new Tweakpane({
            container: document.getElementById('ui-panel'),
            title: 'Warp FX',
            expanded: true
        });

        pane.addInput(pipeline, 'smoothness', { step: 0.1, min: 0, max: 4 });
        pane.addInput(pipeline, 'direction', {
            x: { min: -1, max: 1, step: 0.25 },
            y: { min: -1, max: 1, step: 0.25 }
        });

        this.tweens.add({
            targets: pipeline,
            progress: 1,
            hold: 1000,
            delay: 1000,
            repeatDelay: 1000,
            repeat: -1,
            duration: 3000
        });
    }
}

const config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    scene: Example,
    pipeline: { WarpPostFX }
};

let game = new Phaser.Game(config);
