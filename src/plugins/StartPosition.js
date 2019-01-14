class StartPosition extends Phaser.Plugins.BasePlugin
{
    /*
     * This is a small helper plugin that will let the player
     * start where they last entered a scene,
     * before they closed the browser window last time
     */

    constructor (pluginManager)
    {
        super(pluginManager);
        // this is the very first start position
        this.x = 64;
        this.y = 64;
        this.facing = 'right'; // right or left
        this.startScene = 'mazelevel';
    }

    start()
    {
        let lastExit = localStorage.getItem('mazeexit');
        if (lastExit) {
            console.log('Starting in ' + lastExit);
            this.setExit(JSON.parse(lastExit));
        }
    }

    setExit({
        x = 64,
        y = 64,
        facing = 'right',
        scene = 'mazelevel'
    } = {})
    {
        this.x = x;
        this.y = y;
        this.facing = facing;
        this.startScene = scene;
        localStorage.setItem('mazeexit', JSON.stringify({x, y, facing, scene}));
    }
}

export default StartPosition;
