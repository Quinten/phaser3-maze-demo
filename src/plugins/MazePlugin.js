import generator from 'generate-maze';

class MazePlugin extends Phaser.Plugins.BasePlugin
{
    constructor (pluginManager)
    {
        super(pluginManager);

        this.tileTypes = [
            {top: true, right: true, bottom: true, left: true},
            {top: false, right: false, bottom: false, left: false},
            {top: true, right: false, bottom: true, left: false},
            {top: false, right: true, bottom: false, left: true},

            {top: false, right: true, bottom: false, left: false},
            {top: false, right: false, bottom: false, left: true},
            {top: true, right: false, bottom: false, left: false},
            {top: false, right: false, bottom: true, left: false},

            {top: false, right: false, bottom: true, left: true},
            {top: true, right: false, bottom: false, left: true},
            {top: true, right: true, bottom: false, left: false},
            {top: false, right: true, bottom: true, left: false},

            {top: false, right: true, bottom: true, left: true},
            {top: true, right: false, bottom: true, left: true},
            {top: true, right: true, bottom: false, left: true},
            {top: true, right: true, bottom: true, left: false}
        ];

        this.topLeftMapping = [0, 1, 2, 4, 4, 1, 6, 7, 7, 6, 10, 11, 11, 2, 10, 15];
        this.bottomRightMapping = [0, 1, 2, 5, 1, 5, 6, 7, 8, 9, 6, 7, 8, 13, 14, 2];

        this.maze = undefined;
        this.gridWidth = 0;
        this.gridHeight = 0;
    }

    start()
    {
        //console.log('MazePlugin started...');
    }

    generate(w, h) {
        this.gridWidth = w;
        this.gridHeight = h;
        this.maze = generator(this.gridWidth, this.gridHeight, true);
        for (let col of this.maze) {
            for (let cel of col) {
                for (let t = 0; t < this.tileTypes.length; t++) {
                    if ((cel.top == this.tileTypes[t].top) && (cel.right == this.tileTypes[t].right) && (cel.bottom == this.tileTypes[t].bottom) && (cel.left == this.tileTypes[t].left)) {
                        cel.type = t;
                    }
                }
            }
        }
        return this.maze;
    }

    openTopLeft()
    {
        this.maze[0][0].type = this.topLeftMapping[this.maze[0][0].type];
    }

    openBottomRight()
    {
        this.maze[this.gridHeight - 1][this.gridWidth - 1].type = this.bottomRightMapping[this.maze[this.gridHeight - 1][this.gridWidth - 1].type];
    }
}

export default MazePlugin;
