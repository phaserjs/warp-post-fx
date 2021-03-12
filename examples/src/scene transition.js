import { WarpPostFX } from '../../dist/WarpPostFX.js';

export class Preloader extends Phaser.Scene
{
    constructor ()
    {
        super('Preloader');
    }

    preload ()
    {
        this.load.image('bg', 'assets/background.jpg');
        this.load.image('eyes', 'assets/eyes.png');
        this.load.image('titlescreen', 'assets/titlescreen.jpg');
        this.load.image('logo', 'assets/alienz-logo.png');
        this.load.atlas('ships', 'assets/ships.png', 'assets/ships.json');
    }

    create ()
    {
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNames('ships', { prefix: 'boom', start: 1, end: 11 }),
            frameRate: 12
        });

        this.scene.start('TitleScreen');
    }
}

export class MainGame extends Phaser.Scene
{
    constructor ()
    {
        super('MainGame');
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
        this.bg = this.add.tileSprite(400, 300, 800, 600, 'bg');

        this.createShipsLayer();

        this.input.once('pointerdown', () => {

            this.cameras.main.setPostPipeline(WarpPostFX);

            const pipeline = this.cameras.main.getPostPipeline(WarpPostFX);

            this.scene.transition({
                target: 'TitleScreen',
                duration: 8000,
                moveBelow: true,
                onUpdate: (progress) => {

                    pipeline.setProgress(progress);

                }
            });
        });
    }

    update ()
    {
        this.bg.tilePositionY += 1;
    }
}

export class TitleScreen extends Phaser.Scene
{
    constructor ()
    {
        super('TitleScreen');
    }

    create ()
    {
        const bg = this.add.image(400, 300, 'titlescreen');
        
        const eyes = this.add.image(400, 270, 'eyes');
        
        eyes.setBlendMode(Phaser.BlendModes.ADD);
        eyes.setAlpha(0.25);

        this.add.particles('ships', 'bullet21').createEmitter({
            blendMode: 3,
            gravityY: -100,
            angle: { min: 0, max: 90 },
            alpha: { start: 1, end: 0, ease: 'Linear' },
            lifespan: 1500,
            quantity: 1,
            x: 514,
            y: 265,
            speed: { min: 40, max :80 },
            scale: { start: 0.4, end: 0.1, ease: 'Circ.easeOut' }
        });

        this.add.particles('ships', 'bullet21').createEmitter({
            blendMode: 3,
            gravityY: -100,
            angle: { min: 90, max: 180 },
            alpha: { start: 1, end: 0, ease: 'Linear' },
            lifespan: 1500,
            quantity: 1,
            x: 280,
            y: 265,
            speed: { min: 40, max :80 },
            scale: { start: 0.4, end: 0.1, ease: 'Circ.easeOut' }
        });

        this.add.image(400, 160, 'logo');

        const shine1 = this.add.image(-800, 46, 'ships', 'stage_clear_speedline');
        const shine2 = this.add.image(1800, 220, 'ships', 'stage_clear_speedline');

        shine1.setBlendMode(Phaser.BlendModes.ADD);
        shine2.setBlendMode(Phaser.BlendModes.ADD);

        this.tweens.add({
            targets: bg,
            alpha: 0.25,
            ease: 'Sine.inOut',
            duration: 1500,
            yoyo: true,
            repeat: -1
        });

        this.tweens.add({
            targets: eyes,
            alpha: 1,
            ease: 'Sine.inOut',
            duration: 1500,
            yoyo: true,
            repeat: -1
        });

        this.tweens.add({
            targets: shine1,
            x: 1800,
            ease: 'Power1',
            duration: 2000,
            repeatDelay: 3000,
            repeat: -1
        });

        this.tweens.add({
            targets: shine2,
            x: -800,
            ease: 'Power1',
            duration: 2000,
            delay: 2000,
            repeatDelay: 3000,
            repeat: -1
        });

        this.input.once('pointerdown', () => {

            this.cameras.main.setPostPipeline(WarpPostFX);

            const pipeline = this.cameras.main.getPostPipeline(WarpPostFX);

            this.scene.transition({
                target: 'MainGame',
                duration: 8000,
                moveBelow: true,
                onUpdate: (progress) => {

                    pipeline.setProgress(progress);

                }
            });
        });
    }
}

const config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    scene: [ Preloader, TitleScreen, MainGame ],
    pipeline: { WarpPostFX }
};

let game = new Phaser.Game(config);
