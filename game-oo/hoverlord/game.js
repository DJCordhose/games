function updatePlayer(deltaT) {
    var currentControl = this.control();
    accelerate.call(this, currentControl, deltaT);
    gunControls.call(this, currentControl, deltaT);
    powerpackControl.call(this, currentControl, deltaT);
    playerInertiaMove.call(this, deltaT);
}

function accelerate(currentControl, deltaT) {
    if ('a' in currentControl) this.velocity.x -= this.acceleration * deltaT;
    if ('d' in currentControl) this.velocity.x += this.acceleration * deltaT;
}

function powerpackControl(currentControl, deltaT) {
    if ('r' in currentControl) {
        if (logic.powerPacks.indexOf('Rocket (r)') !== -1) {
            logic.powerPacks.splice(logic.powerPacks.indexOf('Rocket (r)'), 1);
            if (!logic.rocketWasDown) {
                spawnRocket(player);
                logic.rocketWasDown = true;
            }
        }
    } else {
        logic.rocketWasDown = false;
    }
}

function spawnRocket(shooter) {
    var xSpeed = getAngularMovementX(shooter.gun.angle, 10);
    var ySpeed = getAngularMovementY(shooter.gun.angle, 10);

    var r = 100;
    var ball = {
        r: r,
        playerShot: true,
        color: 'red',
        velocity: {
            x: xSpeed,
            y: ySpeed
        },
        position: {
            x: shooter.position.x,
            y: shooter.position.y - r
        },
        acceleration: 1,
        gravity: 0,
        friction: 0,
        draw: drawRocket,
        update: updateShot
    };
    addObject(ball);
    return ball;
}

function drawRocket() {
    context.fillStyle = this.color;
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.r, 0, Math.PI * 2);
    context.fill();
    context.closePath();
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
            spawnShot(player, true, true);
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

function spawnShot(shooter, playerShot, relativeSpeed) {
    var xSpeed = getAngularMovementX(shooter.gun.angle, shooter.gun.power);
    var ySpeed = getAngularMovementY(shooter.gun.angle, shooter.gun.power);
    if (relativeSpeed) {
        xSpeed += shooter.velocity.x;
        ySpeed += shooter.velocity.y;
    }
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
        draw: drawShot,
        update: updateShot
    };
    addObject(ball);
    return ball;
}

function drawShot() {
    context.fillStyle = this.color;
    context.beginPath();
    context.lineWidth = 1.2;
    context.arc(this.position.x, this.position.y, this.r, 0, Math.PI * 2);
    if (!this.playerShot) {
        context.fill();
    } else {
        context.stroke();
    }
    context.closePath();
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
    var angleRadians = (180.0 + angle) * Math.PI / 180.0;
    return Math.cos(angleRadians) * distance;
}

function getAngularMovementY(angle, distance) {
    var angleRadians = (180.0 + angle) * Math.PI / 180.0;
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

logic.enemies = [];
logic.spaceWasDown = false;
logic.maxGunPower = 7.5;

logic.spawnEnemy = function () {
    var r = 15;
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
        draw: drawEnemy,
        update: updateEnemy,
        shotSelection: randomShot,
        velocity : {
            x: (Math.random() * 2.0 + 0.5) * (Math.random() < 0.5 ? 1.0 : -1.0),
            y: 0
        },
        fireRate: fireRate, // 100 = 1s
        nextShot: now() + fireRate,
        pointValue: 100,
        tintColor: 'black',
        bottomHits: 0
    };
    if (Math.random() < 0.1) {
        ball.tintColor = 'red'; // spammer
        ball.fireRate = 20;
        ball.pointValue = 500;
    } else if (Math.random() < 0.25) {
        ball.tintColor = 'green'; // sniper
        ball.fireRate = 150;
        ball.pointValue = 300;
        ball.shotSelection = aimedShot;
        ball.powerPack = 'Shield (q)';
    } else if (Math.random() > 0.9) {
        ball.tintColor = 'blue'; // tank
        ball.fireRate = 200;
        ball.pointValue = 1000;
        ball.topHitOnly = true;
        ball.powerPack = 'Rocket (r)';
    }

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
        ball.color = 'red';
    }
};

function randomShot(deltaT) {
    this.gun.angle = Math.random() * 180.0;
    this.gun.power = Math.random() * 4.0 + 1.0;
    spawnShot(this, false, true);
}

function aimedShot(deltaT) {
    // http://en.wikipedia.org/wiki/Trajectory_of_a_projectile#Angle_required_to_hit_coordinate_.28x.2Cy.29
    var power = 3.0;
    this.gun.power = power;
    //this.gun.angle = Math.random() * 180.0;
    var gravity = 0.035;
    var targetX = player.position.x;
    var rnd = Math.random();
    if (rnd < 0.75) {
        targetX += (Math.random() * 60.0) - 30.0;
    }
    var xDist = -(targetX - this.position.x);
    var yDist = -(player.position.y - this.position.y);
    var reverse = false;
    if (xDist < 0.0) {
        xDist = -xDist;
        reverse = true;
    }
    var angle = power * power * power * power - gravity * (gravity * xDist * xDist + 2 * yDist * power * power);
    if (angle < 0) {
        angle = power * power * power * power + gravity * (gravity * xDist * xDist + 2 * yDist * power * power);
    }
    angle = power * power + Math.sqrt(angle);
    angle /= gravity * xDist;
    angle = Math.atan(angle) * 180.0 / Math.PI;
    if (angle < 0.0 || angle > 180.0) {
        angle = power * power - Math.sqrt(angle);
        angle /= gravity * xDist;
        angle = Math.atan(angle) * 180.0 / Math.PI;
    }
    if (reverse) {
        angle = 180.0 - angle;
    }
    this.gun.angle = angle;
    spawnShot(this, false, false);
}

function updateEnemy(deltaT) {
    /* if (ballsCollide(this, player)) {
     loose();
     } */
    this.position.x += this.velocity.x * deltaT;
    if (this.position.x < this.r) {
        this.position.x += (this.r - this.position.x) * 2;
        this.velocity.x = -this.velocity.x;
    }
    if (this.position.x > (canvas.width - this.r)) {
        this.position.x -= (this.position.x - (canvas.width - this.r)) * 2;
        this.velocity.x = -this.velocity.x;
    }
    if (now() >= this.nextShot) {
        this.shotSelection(deltaT);
        this.nextShot  = now() + this.fireRate;
    }
}

function getLevel() {
    var level = Math.floor(logic.score / 1000.0) + 1;
    return level;
}

function getMaxEnemies() {
    var max = 2 + getLevel();
    if (max > 25) {
        max = 25;
    }
    return max;
}

function getSpawnChance() {
    if (logic.enemies.length == 0) {
        return 1.0;
    } else {
        return (getMaxEnemies() - logic.enemies.length) * 0.0035;
    }
}

logic.update = function (deltaT) {
    if (this.enemies.length == 0 || Math.random() < getSpawnChance() * deltaT && this.enemies.length < getMaxEnemies()) this.spawnEnemy();
    if (gameOver) running = false;
};

logic.powerPacks = ['Rocket (r)'];

// adapted from
// http://www.html5canvastutorials.com/labs/html5-canvas-animals-on-the-beach-game-with-kineticjs/
function loadImages(rootUrl, sources, callback) {
    var images = {};
    var loadedImages = 0;
    for(var index in sources) {
        var src = sources[index];
        var image = new Image();
        images[src] = image;
        image.onload = function() {
            // trigger callback only if all required images have been loaded
            if(++loadedImages >= sources.length) {
                callback(images);
            }
        };
        image.src = rootUrl + '/' + src + '.png';
    }
}

var enemyTintBuffers = {};

function drawEnemy () {
    var dw = 30, dh = 30,
        dx = this.position.x - dw / 2, dy = this.position.y - dh / 2 + 5,
        sx = 0, sy = 0,
        sw = 200, sh = alienImage.height;

    if (this.tintColor == 'black') {
        context.drawImage(alienImage, sx, sy, sw, sh, dx, dy, dw, dh);
    } else {
        if (! (this.tintColor in enemyTintBuffers)) {
            var buffer = document.createElement('canvas');
            buffer.width = dw;
            buffer.height = dh;
            var bx = buffer.getContext('2d');
            bx.fillStyle = this.tintColor;
            bx.fillRect(0, 0, buffer.width, buffer.height);
            bx.globalCompositeOperation = "destination-atop";
            bx.drawImage(alienImage, sx, sy, sw, sh, 0, 0, dw, dh);
            enemyTintBuffers[this.tintColor] = buffer;
        }
        //context.globalAlpha = 0.7;
        context.drawImage(enemyTintBuffers[this.tintColor], dx, dy);
        //context.globalAlpha = 1.0;
    }
}

var alienImage;
// Credit for the art goes to
// - Hyptosis@gmail.com (http://www.newgrounds.com/art/view/hyptosis/tile-art-batch-1)
// - http://4vector.com/free-vector/free-vector-vector-clip-art-alien-spaceship-icon-98467
// - http://www.flaticon.com/png/256/44079.png
loadImages('images/', ['alien_spaceship', 'tank'], function (images) {

    alienImage = images['alien_spaceship'];
    player.draw = function () {
        var image = images['tank'];

        var dw = 40, dh = 40,
            dx = this.position.x - dw / 2, dy = this.position.y - dh / 2 + 5,
            sx = 0, sy = 0,
            sw = image.width, sh = image.height;

        context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);

        drawGunBarrel();
    };

    loop();
})

