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

        this.tweens.add({
            targets: pipeline,
            progress: 1,
            hold: 2000,
            delay: 2000,
            repeatDelay: 2000,
            repeat: -1,
            duration: 3000,
            yoyo: true
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
