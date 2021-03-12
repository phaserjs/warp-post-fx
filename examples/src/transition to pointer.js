import { WarpPostFX } from '../../dist/WarpPostFX.js';

class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('target', 'assets/target.png');
        this.load.image('pic1', 'assets/aliens.jpg');
        this.load.image('pic2', 'assets/warcraft.jpg');
    }

    create ()
    {
        const bg = this.add.image(400, 300, 'pic1').setPostPipeline(WarpPostFX);

        const target = this.add.image(400, 300, 'target');

        const pipeline = bg.getPostPipeline(WarpPostFX);

        pipeline.setTexture('pic2');

        this.input.on('pointermove', pointer => {

            pipeline.progress = pointer.x / 800;

            target.x = pointer.worldX;
            target.y = pointer.worldY;

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
