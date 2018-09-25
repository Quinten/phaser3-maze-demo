import Level from './Level.js';

class MazeLevel extends Level {

    constructor (config)
    {
        super((config) ? config : { key: 'mazelevel' });
        this.prefabShardWidth = 128;
        this.prefabShardHeight = 128;
        this.prefabMapWidth = 0;
        this.prefabMapHeight = 0;
    }

    create()
    {
        super.create();

        // setup stuff
        // ...
        this.addPlayer({ x: this.startPosition.x, y: this.startPosition.y });

        // generate the maze (see MazePlugin.js)
        let maze = this.maze.generate(32, 8);
        // make the topLeft and bottomRight of the maze open so we can add exits
        this.maze.openTopLeft();
        this.maze.openBottomRight();

        // remember some stuff
        this.prefabMapWidth = this.prefabShardWidth * this.maze.gridWidth;
        this.prefabMapHeight = this.prefabShardHeight * this.maze.gridHeight;
        // clip the camera and physics,
        // make the camera a little smaller
        // so the player can walk of the screen
        this.cameras.main.setBounds(16, 0, this.prefabMapWidth - 32, this.prefabMapHeight);
        this.physics.world.setBounds(0, 0, this.prefabMapWidth, this.prefabMapHeight);

        // add maps
        for (let col of this.maze.maze) {
            for (let cel of col) {
                if (cel.type !== undefined) {
                    // use the function from the main Level class
                    this.addMap({
                        key: 'map' + cel.type,
                        clipCamera: false,
                        x: cel.x * this.prefabShardWidth,
                        y: cel.y * this.prefabShardHeight
                    });
                }
            }
        }

        // add exit zones
        this.addExit({ scene: 'mazelevel', w: 496, startX: 4032, startY: 960, facing: 'left' });
        this.addExit({ scene: 'mazelevel', x: 4080, startX: 64, startY: 64, facing: 'right' });

        this.cameras.main.setBackgroundColor('#85615a');

        this.postCreate();

    }

    update(time, delta)
    {
        this.player.update(this.controls, time, delta);
        this.checkExits();
    }
}

export default MazeLevel;
