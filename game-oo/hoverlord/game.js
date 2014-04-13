function updatePlayer(deltaT) {
    var currentControl = this.control();
    accelerate.call(this, currentControl, deltaT);
    inertiaMove.call(this, deltaT);
}

var player = {
    r: 10,
    color: 'blue',
    velocity: {
        x: 0,
        y: 0
    },
    maxSpeed: 5000,
    position: {
        x: 100,
        y: 100
    },
    acceleration: 0.95,
    gravity: 0.0,
    friction: 0.15, // multiplicative
    update: updatePlayer,
    draw: drawBall,
    control: control
};
player.position.x = canvas.width / 2,
player.position.y = canvas.height - 20

addObject(player);

logic.name = 'hoverlord';
logic.description = 'Hit green balls and avoid red ones. Accelerate by using cursor keys.';
logic.score = 0;
logic.enemySpawnChance = 0.1;
logic.enemiesSpawned = 0;
logic.maxEnemies = 10;

logic.createBall = function () {
    var r = 10;
    var distFromBottom = 50;
    var ball = {
        r: r,
        position: {
            x: Math.round(Math.random() * (canvas.width - distFromBottom) + r),
            y: Math.round(Math.random() * (canvas.height - distFromBottom) + r)
        },
        draw: drawBall,
        moveSpeed: (Math.random() * 2.0 + 0.5) * (Math.random() < 0.5 ? 1.0 : -1.0)
    };
    addObject(ball);
    return ball;
};

/* logic.createGreenBall = function () {
    var thisLogic = this;
    var ball = this.createBall();
    ball.color = 'green';
    ball.update = function () {
        if (ballsCollide(ball, player)) {
            playSoundGood();
            thisLogic.score++;
            removeObject(ball);
        }
    };
}; */

logic.spawnEnemy = function () {
    var ball = this.createBall();
    // don't immediately collide with player
    var playerWithExtendedRadius = {
        position: {
            x: player.position.x,
            y: player.position.y
        },
        r: player.r * 5
    };
    if (ballsCollide(ball, playerWithExtendedRadius)) {
        removeObject(ball);
    } else {
        logic.enemiesSpawned++;
        ball.color = 'red';
        ball.update = function (deltaT) {
            if (ballsCollide(ball, player)) {
                loose();
            }
            this.position.x += this.moveSpeed * deltaT;
            if (this.position.x < this.r) {
                this.position.x += (this.r - this.position.x) * 2;
                this.moveSpeed = -this.moveSpeed;
            }
            if (this.position.x > (canvas.width - this.r)) {
                this.position.x -= (this.position.x - (canvas.width - this.r)) * 2;
                this.moveSpeed = -this.moveSpeed;
            }
        };
    }
};

logic.update = function () {
    //if (Math.random() < this.greenBallLikeliness) this.createGreenBall();
    if (Math.random() < this.enemySpawnChance && this.enemiesSpawned < this.maxEnemies) this.spawnEnemy();
    if (gameOver) running = false;
};

loop();
