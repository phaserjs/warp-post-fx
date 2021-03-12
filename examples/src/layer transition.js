import { WarpPostFX } from '../../dist/WarpPostFX.js';

class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('bg', 'assets/background.jpg');
        this.load.image('splash', 'assets/splash.jpg');
        this.load.atlas('ships', 'assets/ships.png', 'assets/ships.json');
    }

    createShipsLayer ()
    {
        const layer = this.add.layer();

        const ships = [ 'airshipA', 'airshipB', 'alienB', 'alienC', 'AlienMissileExpertB', 'AlienMissileExpertC', 'meteoriteS', 'bullet15' ];

        for (let i = 0; i < 64; i++)
        {
            let x = Phaser.Math.Between(-100, 900);
            let y = Phaser.Math.Between(-600, -200);

            let frame = Phaser.Utils.Array.GetRandom(ships);

            let ship = this.add.image(x, y, 'ships', frame);

            ship.setDepth(y);

            this.tweens.add({
                targets: ship,
                y: '+=1400',
                delay: Phaser.Math.Between(0, 4000),
                duration: Phaser.Math.Between(2000, 6000),
                ease: 'Linear',
                repeat: -1
            });

            layer.add(ship);
        }

        return layer;
    }

    create ()
    {
        this.add.image(400, 300, 'bg');

        const space = this.createShipsLayer();

        space.setPostPipeline(WarpPostFX);

        const pipeline = space.getPostPipeline(WarpPostFX);

        pipeline.setTexture('splash');

        this.tweens.add({
            targets: pipeline,
            progress: 1,
            delay: 4000,
            repeatDelay: 3000,
            hold: 1000,
            yoyo: true,
            repeat: -1,
            duration: 3000
        });
    }
}

const config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#0a0067',
    parent: 'phaser-example',
    scene: Example,
    pipeline: { WarpPostFX }
};

let game = new Phaser.Game(config);
