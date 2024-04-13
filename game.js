// Create our only scene called mainScene, in the game.js file
class mainScene {    
    preload() {
        this.load.image("ball", "img/ball.png");
        this.load.image('paddle', 'img/paddle.png');
        this.load.image("brick", "img/brick.png");
    }
    create() {
        this.ball = this.physics.add.sprite(
            this.sys.game.config.width * 0.5,
            this.sys.game.config.height - 25,
            "ball"
        );
        this.ball.setOrigin(0.5);

        this.physics.world.enable(this.ball);
        
        this.ball.body.velocity.set(200, 200);
        // this.ball.body.gravity.y = 100;
        this.ball.body.collideWorldBounds = true;
        this.ball.body.bounce.set(1)

        this.ball.body.onWorldBounds = true;
        this.physics.world.on('worldbounds', (_, __, down) => {
            if (down) {
                alert('You lose !')
                location.reload()
            }
        })
        
        this.paddle = this.physics.add.sprite(
            this.sys.game.config.width * 0.5,
            this.sys.game.config.height - 5,
            "paddle"
        );
        this.paddle.setOrigin(0.5, 1);
        this.physics.world.enable(this.paddle);
        this.paddle.body.immovable = true;

        this.initBricks();
    }
    update() {
        this.physics.collide(this.ball, this.paddle);
        this.physics.collide(this.ball, this.bricks, this.ballHitBrick);
        this.paddle.x = this.input.x || this.sys.game.config.width * 0.5;
    }

    initBricks() {
        let brickInfo = {
            width: 50,
            height: 20,
            count: {
              row: 3,
              col: 7,
            },
            offset: {
              top: 50,
              left: 60,
            },
            padding: 10,
        }
        this.bricks = this.physics.add.group({
            immovable: true
        });

        for (let i = 0; i < brickInfo.count.col; i++) {
            for (let j = 0; j < brickInfo.count.row; j++) {
                const brickX =
                    i * (brickInfo.width + brickInfo.padding) + brickInfo.offset.left;
                const brickY =
                    j * (brickInfo.height + brickInfo.padding) + brickInfo.offset.top;
                let newBrick = this.physics.add.sprite(brickX, brickY, "brick");
                newBrick.setOrigin(0.5);
                this.physics.world.enable(newBrick, Phaser.Physics.ARCADE);
                this.bricks.add(newBrick);
            }
        }
    }

    ballHitBrick(ball, brick) {
        brick.destroy()
    }
}

new Phaser.Game({
    width: 480,
    height: 320,
    backgroundColor: '#eee',
    scene: mainScene,
    physics: { default: 'arcade' },
    parent: 'game',
});
