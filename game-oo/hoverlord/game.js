function updatePlayer(deltaT) {
    var currentControl = this.control();
    accelerate.call(this, currentControl, deltaT);
    gunControls.call(this, currentControl, deltaT);
    playerInertiaMove.call(this, deltaT);
}

function accelerate(currentControl, deltaT) {
    if ('a' in currentControl) this.velocity.x -= this.acceleration * deltaT;
    if ('d' in currentControl) this.velocity.x += this.acceleration * deltaT;
}

function gunControls(currentControl, deltaT) {
    //if ('up' in currentControl) this.velocity.y -= this.acceleration * deltaT;
    //if ('down' in currentControl) this.velocity.y += this.acceleration * deltaT;
    //if ('left' in currentControl) this.velocity.x -= this.acceleration * deltaT;
    //if ('right' in currentControl) this.velocity.x += this.acceleration * deltaT;
    if ('left' in currentControl) this.gun.angle -= 2.0 * deltaT;
    if ('right' in currentControl) this.gun.angle += 2.0 * deltaT;
    if (('w' in currentControl) || ('up' in currentControl)) this.gun.power += 0.12 * deltaT;
    if (('s' in currentControl) || ('down' in currentControl)) this.gun.power -= 0.12 * deltaT;
    if (this.gun.angle < 0.0) {
        this.gun.angle = 0.0;
    }
    if (this.gun.angle > 180.0) {
        this.gun.angle = 180.0;
    }
    if (this.gun.power < 0.25) {
        this.gun.power = 0.25;
    }
    if (this.gun.power > logic.maxGunPower) {
        this.gun.power = logic.maxGunPower;
    }
    if ('space' in currentControl) {
        if (!logic.spaceWasDown) {
          playPlayerShotSound();
          spawnShot(player, true);
          logic.spaceWasDown = true;
        }
    } else {
        logic.spaceWasDown = false;
    }
}

function playPlayerShotSound() {
    frequency = 2000;
    var oscillator = createOscillator(audioContext, frequency);
    oscillator.type = "triangle";
    oscillator.start(audioContext.currentTime); // play now
    oscillator.stop(audioContext.currentTime + 0.15); // seconds
    frequency = 500;
    oscillator = createOscillator(audioContext, frequency);
    oscillator.type = "sine";
    oscillator.start(audioContext.currentTime + 0.15); // play now
    oscillator.stop(audioContext.currentTime + 0.35); // seconds
    /* frequency = 250;
    oscillator = createOscillator(audioContext, frequency);
    oscillator.type = oscillator.NOISE;
    oscillator.start(audioContext.currentTime + 0.45); // play now
    oscillator.stop(audioContext.currentTime + 0.7); // seconds */
}

function spawnShot(shooter, playerShot) {
    var xSpeed = getAngularMovementX(shooter.gun.angle, shooter.gun.power);
    var ySpeed = getAngularMovementY(shooter.gun.angle, shooter.gun.power);
    var ball = {
        r: 5,
        playerShot: playerShot,
        color: playerShot ? 'black' : 'red',
        velocity: {
            x: xSpeed,
            y: ySpeed
        },
        maxSpeed: 5000,
        position: {
            x: shooter.position.x,
            y: shooter.position.y
        },
        acceleration: 0.0,
        gravity: 0.035,
        friction: 0.0,
        draw: drawBall,
        update: updateShot
    };
    addObject(ball);
    return ball;
}

function drawPlayer() {
    context.fillStyle = this.color;
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.r, 0, Math.PI * 2);
    context.fill();
    context.closePath();
    drawGunBarrel();
}

function drawGunBarrel() {
    var length = player.r + 15.0 * (player.gun.power / logic.maxGunPower);
    var baseX = player.position.x;
    var baseY = player.position.y;
    var pointX = getAngularMovementX(player.gun.angle, length) + baseX;
    var pointY = getAngularMovementY(player.gun.angle, length) + baseY;
    context.fillStyle = 'blue';
    context.beginPath();
    context.lineWidth = 4;
    context.moveTo(baseX, baseY);
    context.lineTo(pointX, pointY);
    context.stroke();
    context.closePath();
}

function getAngularMovementX(angle, distance) {
    var angleRadians = (180.0 + player.gun.angle) * Math.PI / 180.0;
    return Math.cos(angleRadians) * distance;
}

function getAngularMovementY(angle, distance) {
    var angleRadians = (180.0 + player.gun.angle) * Math.PI / 180.0;
    return Math.sin(angleRadians) * distance;
}

function drawHud() {
    var baseX = canvas.width - 75;
    var baseY = 75;
    var length = 55;
    var pointX = getAngularMovementX(player.gun.angle, length) + baseX;
    var pointY = getAngularMovementY(player.gun.angle, length) + baseY;
    context.fillStyle = 'black';
    context.beginPath();
    context.arc(baseX, baseY, 15, 0, Math.PI * 2);
    context.fill();
    context.closePath();
    context.beginPath();
    context.lineWidth = 15;
    context.moveTo(baseX, baseY);
    context.lineTo(pointX, pointY);
    context.stroke();
    context.closePath();
    var rectX = canvas.width - 160;
    var rectY = 20;
    var width = 25;
    var height = 70;
    context.beginPath();
    context.lineWidth = 3;
    context.rect(rectX, rectY, width, height);
    context.stroke();
    context.closePath();
    var barHeight = (height - 6) * (player.gun.power / logic.maxGunPower);
    var barX = rectX + 3;
    var barY = rectY + 3 + (height - 6 - barHeight);
    context.fillStyle = 'red';
    context.beginPath();
    context.lineWidth = 3;
    context.fillRect(barX, barY, width - 6, barHeight);
    context.stroke();
    context.closePath();
}

function updateShot(deltaT) {
    shotInertiaMove.call(this, deltaT);
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
    gun: {
        angle: 90.0, // 0 = left, 90 = up, 180 = right
        power: 5.0
    },
    acceleration: 0.95,
    gravity: 0.0,
    friction: 0.15, // multiplicative
    update: updatePlayer,
    draw: drawPlayer,
    control: control
};
player.position.x = canvas.width / 2,
player.position.y = canvas.height - 20

addObject(player);

logic.name = 'hoverlord';
logic.description = 'Shoot enemies and avoid their shots.';
logic.score = 0;
logic.enemySpawnChance = 0.008;
logic.enemies = [];
logic.maxEnemies = 10;
logic.spaceWasDown = false;
logic.maxGunPower = 7.5;

logic.spawnEnemy = function () {
    var r = 10;
    var distFromBottom = 100;
    var distFromTop = 150;
    var fireRate = 100.0;
    var ball = {
        r: r,
        position: {
            x: Math.round(Math.random() * (canvas.width - distFromBottom - distFromTop) + r + distFromTop),
            y: Math.round(Math.random() * (canvas.height - distFromBottom - distFromTop) + r + distFromTop)
        },
        gun: {
            angle: 90.0, // 0 = left, 90 = up, 180 = right
            power: 5.0
        },
        draw: drawBall,
        update: updateEnemy,
        moveSpeed: (Math.random() * 2.0 + 0.5) * (Math.random() < 0.5 ? 1.0 : -1.0),
        fireRate: fireRate, // 100 = 1s
        nextShot: now() + fireRate
    };
    addObject(ball);
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
        logic.enemies.push(ball);
        ball.pointValue = 100;
        ball.color = 'red';
    }
};

function updateEnemy(deltaT) {
    /* if (ballsCollide(this, player)) {
        loose();
    } */
    this.position.x += this.moveSpeed * deltaT;
    if (this.position.x < this.r) {
        this.position.x += (this.r - this.position.x) * 2;
        this.moveSpeed = -this.moveSpeed;
    }
    if (this.position.x > (canvas.width - this.r)) {
        this.position.x -= (this.position.x - (canvas.width - this.r)) * 2;
        this.moveSpeed = -this.moveSpeed;
    }
    if (now() >= this.nextShot) {
        this.gun.angle = Math.random() * 180.0;
        this.gun.power = Math.random() * 4.0 + 0.5;
        spawnShot(this, false);
        this.nextShot  = now() + this.fireRate;
    }
}

logic.update = function (deltaT) {
    if (this.enemies.length == 0 || Math.random() < this.enemySpawnChance * deltaT && this.enemies.length < this.maxEnemies) this.spawnEnemy();
    if (gameOver) running = false;
};

loop();