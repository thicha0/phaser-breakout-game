// Create our only scene called mainScene, in the game.js file
class mainScene {    
    preload() {
        this.load.image("ball", "img/ball.png");
        this.load.image('paddle', 'img/paddle.png');
        this.load.image("brick", "img/brick.png");
        this.load.spritesheet("wobble", "img/wobble.png", {
            frameWidth: 20,
            frameHeight: 20
        });
    }
    create() {
        this.lives = 3
        this.livesText = this.add.text(this.sys.game.config.width - 5, 5, `Lives: ${this.lives}`, {
            font: "18px Arial",
            fill: "#0095DD",
        })
        this.livesText.setOrigin(1, 0)
        this.lifeLostText = this.add.text(this.sys.game.config.width * 0.5, this.sys.game.config.height * 0.5, "You lost a life, click to continue", {
            font: "18px Arial",
            fill: "#0095DD",
        })
        this.lifeLostText.setOrigin(0.5)
        this.lifeLostText.setVisible(false)

        this.ball = this.physics.add.sprite(
            this.sys.game.config.width * 0.5,
            this.sys.game.config.height - 25,
            "ball"
        );
        this.ball.setOrigin(0.5);
        this.anims.create({
            key: "wobble",
            frames: this.anims.generateFrameNumbers("wobble", { frames: [0, 1, 0, 2, 0] }),
            frameRate: 15,
            repeat: 1
        })

        this.physics.world.enable(this.ball);
        
        this.ball.body.velocity.set(200, 200);
        // this.ball.body.gravity.y = 100;
        this.ball.body.collideWorldBounds = true;
        this.ball.body.bounce.set(1)

        this.ball.body.onWorldBounds = true;
        this.physics.world.on('worldbounds', this.ballLeaveScreen.bind(this))
        
        this.paddle = this.physics.add.sprite(
            this.sys.game.config.width * 0.5,
            this.sys.game.config.height - 5,
            "paddle"
        );
        this.paddle.setOrigin(0.5, 1);
        this.physics.world.enable(this.paddle);
        this.paddle.body.immovable = true;

        this.initBricks();

        this.scoreText = this.add.text(5, 5, "Points: 0", {
            font: "18px Arial",
            fill: "#0095DD",
        });
        this.score = 0
    }
    update() {
        this.physics.collide(this.ball, this.paddle, this.ballHitPaddle.bind(this));
        this.physics.collide(this.ball, this.bricks, this.ballHitBrick.bind(this));
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
        ball.play('wobble')
        // brick.destroy()
        const tween = this.tweens.add({
            targets: brick,
            duration: 200,
            scaleX: 0,
            scaleY: 0,
            onComplete: () => {
                brick.destroy();
            }
        })

        this.score += 10
        this.scoreText.setText(`Points: ${this.score}`)
        
        if (this.bricks.children.entries.length === 0) {
            alert("You won the game, congratulations!");
            location.reload();
        }
    }

    ballHitPaddle(ball, paddle) {
        ball.play('wobble')
    }

    ballLeaveScreen(_, __, down) {
        if (down) {
            this.lives--
            if (this.lives > 0) {
                this.livesText.setText(`Lives: ${this.lives}`)
                this.lifeLostText.visible = true;
                this.ball.body.velocity.set(0, 0)
                this.ball.setPosition(this.sys.game.config.width * 0.5, this.sys.game.config.height - 25)
                this.paddle.setPosition(this.sys.game.config.width * 0.5, this.sys.game.config.height - 5)
                this.input.once('pointerdown', () => {
                    this.lifeLostText.visible = false;
                    this.ball.body.velocity.set(200, 200);
                }, this);
            } else {
                alert("You lost all your lives, better luck next time!")
                location.reload()
            }
        }
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
