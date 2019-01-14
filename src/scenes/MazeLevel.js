import Level from './Level.js';

class MazeLevel extends Level {

    constructor (config)
    {
        super((config) ? config : { key: 'mazelevel' });
        this.prefabShardWidth = 128; // 16 tiles of 8 pixels
        this.prefabShardHeight = 128;
        this.prefabMapWidth = 0;
        this.prefabMapHeight = 0;
    }

    create()
    {
        super.create();

        // setup stuff

        // Add the player (see Level.js)
        this.addPlayer({ x: this.startPosition.x, y: this.startPosition.y });

        // generate the maze (see MazePlugin.js)
        let maze = this.maze.generate(32, 8);
        // make the topLeft and bottomRight of the maze open so we can add exits
        this.maze.openTopLeft();
        this.maze.openBottomRight();

        // calculate total size in pixels
        this.prefabMapWidth = this.prefabShardWidth * this.maze.gridWidth;
        this.prefabMapHeight = this.prefabShardHeight * this.maze.gridHeight;
        // clip the camera and physics,
        // make the camera a little smaller
        // so the player can walk off the screen
        this.cameras.main.setBounds(16, 0, this.prefabMapWidth - 32, this.prefabMapHeight);
        this.physics.world.setBounds(0, 0, this.prefabMapWidth, this.prefabMapHeight);

        // get the merged tile data
        let tiledata = this.maze.createMapData({ key: 'map', shardW: 16, shardH: 16 });

        // create the map
        let map = this.make.tilemap({ data: tiledata, tileWidth: 8, tileHeight: 8});
        let tiles = map.addTilesetImage('tiles', 'tiles', 8, 8, 0, 0);
        let layer = map.createStaticLayer(0, tiles, 0, 0);
        map.setCollisionBetween(192, 255);
        this.physics.add.collider(this.player, layer);

        // add exit zones (see Level.js)
        this.addExit({ scene: 'mazelevel', w: 496, startX: 4032, startY: 960, facing: 'left' });
        this.addExit({ scene: 'mazelevel', x: 4080, startX: 64, startY: 64, facing: 'right' });

        this.cameras.main.setBackgroundColor('#85615a');

        // (see Level.js)
        this.postCreate();

    }

    update(time, delta)
    {
        this.player.update(this.controls, time, delta);
        this.checkExits();
    }
}

export default MazeLevel;
