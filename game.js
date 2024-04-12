// Create our only scene called mainScene, in the game.js file
class mainScene {    
    preload() {
        this.load.image("ball", "img/ball.png");
        this.load.image('paddle', 'img/paddle.png');
    }
    create() {
        this.ball = this.physics.add.sprite(
            this.sys.game.config.width * 0.5,
            this.sys.game.config.height - 25,
            "ball"
        );
        this.ball.setOrigin(0.5);

        this.physics.world.enable(this.ball);
        
        this.ball.body.velocity.set(150, -150);
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
    }
    update() {
        this.physics.collide(this.ball, this.paddle);
        this.paddle.x = this.input.x || this.sys.game.config.width * 0.5;
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
