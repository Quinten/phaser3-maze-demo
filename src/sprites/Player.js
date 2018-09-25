class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, key, frame, facing) {
        super(scene, x, y, key, frame);
        scene.physics.world.enable(this);
        scene.add.existing(this);

        this.setDepth(1);
        this.setSize(8, 24, true);
        this.setOffset(12, 8, true);
        this.setCollideWorldBounds(true);

        // tweak stuff
        this.speedMax = 120;
        this.speedChange = 10;
        this.jumpPower = 278;

        // not tweakable
        this.facing = facing || 'right';
        this.idle = false;
        this.jumpTimer = 0;
        this.moveSpeed = 0;
        this.ani = 'idle-left';
        this.alive = true;

        let anims = this.anims.animationManager;
        if (!anims.get('idle-left')) {
            anims.create({
                key: 'idle-left',
                frames: anims.generateFrameNumbers('player', { start: 5, end: 5 }),
                frameRate: 10,
                repeat: -1
            });
        }
        if (!anims.get('idle-right')) {
            anims.create({
                key: 'idle-right',
                frames: anims.generateFrameNumbers('player', { start: 0, end: 0 }),
                frameRate: 10,
                repeat: -1
            });
        }
        if (!anims.get('run-left')) {
            anims.create({
                key: 'run-left',
                frames: anims.generateFrameNumbers('player', { start: 6, end: 8 }),
                frameRate: 10,
                repeat: -1
            });
        }
        if (!anims.get('run-right')) {
            anims.create({
                key: 'run-right',
                frames: anims.generateFrameNumbers('player', { start: 1, end: 3 }),
                frameRate: 10,
                repeat: -1
            });
        }
        if (!anims.get('jump-left')) {
            anims.create({
                key: 'jump-left',
                frames: anims.generateFrameNumbers('player', { start: 9, end: 9 }),
                frameRate: 10,
                repeat: -1
            });
        }
        if (!anims.get('jump-right')) {
            anims.create({
                key: 'jump-right',
                frames: anims.generateFrameNumbers('player', { start: 4, end: 4 }),
                frameRate: 10,
                repeat: -1
            });
        }
        if (!anims.get('flail-left')) {
            anims.create({
                key: 'flail-left',
                frames: anims.generateFrameNumbers('player', { start: 9, end: 9 }),
                frameRate: 10,
                repeat: -1
            });
        }
        if (!anims.get('flail-right')) {
            anims.create({
                key: 'flail-right',
                frames: anims.generateFrameNumbers('player', { start: 4, end: 4 }),
                frameRate: 10,
                repeat: -1
            });
        }
        if (!anims.get('slide-left')) {
            anims.create({
                key: 'slide-left',
                frames: anims.generateFrameNumbers('player', { start: 10, end: 10 }),
                frameRate: 10,
                repeat: -1
            });
        }
        if (!anims.get('slide-right')) {
            anims.create({
                key: 'slide-right',
                frames: anims.generateFrameNumbers('player', { start: 11, end: 11 }),
                frameRate: 10,
                repeat: -1
            });
        }
    }

    update(controls, time, delta) {

        if (!this.alive) {
            return;
        }

        // in a later tutorial i will show you how you can climb and swim
        this.runAndJump(controls, time, delta);

        // don't forget to animate :)
        this.anims.play(this.ani, true);
    }

    runAndJump(controls, time, delta)
    {
        this.body.setVelocityX(0);
        this.body.allowGravity = true;

        if (controls.left) {

            this.moveSpeed -= this.speedChange;
            this.moveSpeed = Math.max(this.moveSpeed, -this.speedMax);
            this.body.setVelocityX(this.moveSpeed);

            this.facing = 'left';
            this.idle = false;

        } else if (controls.right) {

            this.moveSpeed += this.speedChange;
            this.moveSpeed = Math.min(this.moveSpeed, this.speedMax);
            this.body.setVelocityX(this.moveSpeed);

            this.facing = 'right';
            this.idle = false;

        } else {

            this.moveSpeed += (0 - this.moveSpeed) / 2;
            this.body.setVelocityX(this.moveSpeed);

            this.idle = true;

        }

        if (controls.aDown && (this.body.onFloor() || this.body.onWall()) && time > this.jumpTimer) {
            this.body.setVelocityY(-this.jumpPower);
            this.jumpTimer = time + 250;

            if (this.body.blocked.left) {
                this.moveSpeed = this.speedMax;
                this.setVelocityX(this.moveSpeed);
            } else if (this.body.blocked.right) {
                this.moveSpeed = -this.speedMax;
                this.setVelocityX(this.moveSpeed);
            }
        }

        if (this.body.onFloor()) {

            if (this.idle) {

                if (this.facing === 'left') {
                    this.ani = 'idle-left';
                } else {
                    this.ani = 'idle-right';
                }

            } else {

                if (this.facing === 'left') {
                    this.ani = 'run-left';
                } else {
                    this.ani = 'run-right';
                }

            }

        } else {

             if (this.body.blocked.left) {

                this.ani = 'slide-left';

             } else if (this.body.blocked.right) {

                this.ani = 'slide-right';

            } else if (this.body.velocity.y < 0) {

                if (this.facing === 'left') {
                    this.ani = 'jump-left';
                } else {
                    this.ani = 'jump-right';
                }

            } else {

                if (this.facing === 'left') {
                    this.ani = 'flail-left';
                } else {
                    this.ani = 'flail-right';
                }

            }
        }
    }

    disappear()
    {
        this.alive = false;
        this.visible = false;
        this.body.enable = false;
    }
}

export default Player;
