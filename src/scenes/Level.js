import Player from '../sprites/Player.js';

class Level extends Phaser.Scene {

    constructor (config)
    {
        super((config) ? config : { key: 'level' });
        this.gamepaused = undefined;

        // not all levels but some
        this.maps = undefined;
        this.tiles = undefined;
        this.layers = undefined;
        this.centerMap = undefined;
        this.player = undefined;
        this.exits = undefined;
    }

    create()
    {
        this.cameras.main.setRoundPixels(true);
        // start controls
        this.controls.start();

        this.maps = [];
        this.tiles = [];
        this.layers = [];
        this.centerMap = undefined;
        this.exits = [];
        this.cameras.main.setBackgroundColor('#00FF00');
    }

    postCreate()
    {
        this.gamepaused = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'gamepaused');
        this.gamepaused.visible = false;
        this.gamepaused.setScrollFactor(0);
        this.gamepaused.setDepth(3);

        //console.log(this);
        this.resizeField(this.sys.game.config.width, this.sys.game.config.height);
        this.cameras.main.flash(3000, fadeColor.r, fadeColor.g, fadeColor.b);
    }

    addMap({
        key = 'map',
        clipCamera = true,
        clipLeft = 0,
        clipRight = 0,
        clipTop = 0,
        clipBottom = 0,
        centerMap = false,
        collidePlayer = true,
        x = 0,
        y = 0,
        tiles = 'tiles',
        extruded = false
    } = {}) {

        let map = this.make.tilemap({ key: key });
        let tile;
        if (extruded) {
            tile = map.addTilesetImage(tiles, tiles + '-extruded', 8, 8, 1, 2);
        } else {
            tile = map.addTilesetImage(tiles, tiles);
        }
        let layer = map.createStaticLayer(0, tile, x, y);
        //console.log(map.widthInPixels);
        //console.log(map.heightInPixels);
        if (clipCamera) {
            this.cameras.main.setBounds(clipLeft, clipTop, map.widthInPixels - clipLeft - clipRight, map.heightInPixels - clipTop - clipBottom);
            this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        }
        if (centerMap) {
            this.centerMap = map;
            this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        }

        // only up collisions
        map.setCollisionBetween(65, 80);
        map.forEachTile((tile) => {
            if (tile.index < 65 || tile.index > 80) {
                return;
            }
            tile.collideUp = true;
            tile.collideDown = false;
            tile.collideLeft = false;
            tile.collideRight = false;
        }, this, 0, 0, map.width, map.height);

        // all round collisions
        map.setCollisionBetween(193, 256);

        // is it a platform map?
        if (collidePlayer) {
            this.physics.add.collider(this.player, layer);
        }

        this.maps.push(map);
        this.tiles.push(tile);
        this.layers.push(layer);
    }

    addPlayer({
        x = 64,
        y = 64
    } = {}) {
        this.player = new Player(this, x, y, 'player', 0, this.startPosition.facing);
        this.cameras.main.startFollow(this.player, true);
    }

    addExit({
        x = -480,
        y = 0,
        w = 512,
        h = 2048,
        startX = 64,
        startY = 64,
        facing = 'right',
        scene = false
    } = {}) {
        if (!scene) {
            return;
        }
        let exit = {
            rect: new Phaser.Geom.Rectangle(x, y, w, h),
            startX: startX,
            startY: startY,
            facing: facing,
            scene: scene
        };
        this.exits.push(exit);
    }

    checkExits()
    {
        if (!this.exits || !this.exits.length || !this.player) {
            return;
        }
        for (let exit of this.exits) {
            if (Phaser.Geom.Rectangle.ContainsPoint(exit.rect, this.player)) {
                //console.log('time to go');
                this.leaveThroughExit(exit);
                this.player.disappear();
                this.exits = [];
                break;
            }
        }
    }

    leaveThroughExit({
        startX = 0,
        startY = 0,
        facing = 'right',
        scene = false
    } = {}) {
        if (!scene) {
            return;
        }
        this.startPosition.setExit({ x: startX, y: startY, facing: facing, scene: scene });
        this.cameras.main.once('camerafadeoutcomplete', (camera) => {
            this.scene.start(scene);
        }, this);
        fadeColor = { r: 5, g: 4, b: 4 };
        this.cameras.main.fadeOut(3000, fadeColor.r, fadeColor.g, fadeColor.b);
    }

    resizeField(w, h)
    {
        //console.log(w, h);
        this.gamepaused.x = w / 2;
        this.gamepaused.y = h / 2;
        if (this.centerMap) {
            this.cameras.main.setBounds((this.centerMap.widthInPixels - w) / 2, (this.centerMap.heightInPixels - h) / 2, w, h);
        }
    }

    onGamePause()
    {
        this.gamepaused.visible = true;
    }

    onGameResume()
    {
        this.gamepaused.visible = false;
    }
}

export default Level;
