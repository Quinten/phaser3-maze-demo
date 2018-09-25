class Preloader extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'preloader' });
    }

    preload ()
    {
        // just a preload bar in graphics
        let progress = this.add.graphics();
        this.load.on('progress', (value) => {
            progress.clear();
            progress.fillStyle(0x73c494, 1);
            progress.fillRect(0, (this.sys.game.config.height / 2) - 30, this.sys.game.config.width * value, 60);
        });
        this.load.on('complete', () => {
            progress.destroy();
        });

        // Load assets here
        // ...
        this.load.image('tiles', 'assets/tiles.png');
        for (let m = 0; m < 16; m++) {
            this.load.tilemapTiledJSON('map' + m, 'assets/map' + m + '.json');
        }
        this.load.spritesheet('player', 'assets/player.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('gamepaused', 'assets/gamepaused.png');
    }

    create ()
    {
        this.scene.start(this.startPosition.startScene);
    }

}

export default Preloader;
