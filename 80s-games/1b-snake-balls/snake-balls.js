player.color = '#A08020';
player.past = [];
player.tailLength = 100;

function checkTailCollision() {
    this.past.forEach(function (coordinate, index) {
        // skip the first few tail balls in order not to collide with directly adjacent ones
        if (index > this.past.length - this.r * 5) return;
        var tailBall = {
            r: this.r,
            position: {
                x: coordinate.x,
                y: coordinate.y
            }
        };
        if (ballsCollide(this, tailBall)) {
            loose();
        }
    }, this);
}
player.update = function (deltaT) {
    updatePlayer.call(this, deltaT);

    // move tail
    addToPast.call(this);

    checkTailCollision.call(this);
};

function movesLeft() {
    return this.velocity.x < 0 && Math.abs(this.velocity.x) > Math.abs(this.velocity.y);
}

function movesRight() {
    return this.velocity.x > 0 && Math.abs(this.velocity.x) > Math.abs(this.velocity.y);
}

function movesUp() {
    return this.velocity.y < 0 && Math.abs(this.velocity.x) < Math.abs(this.velocity.y);
}

function movesDown() {
    return this.velocity.y > 0 && Math.abs(this.velocity.x) < Math.abs(this.velocity.y);
}

function relativeControl() {
    return function () {
        var originalControl = {};
        keyboardControl(originalControl);
        var relativeControl = {};

        if (movesLeft.call(this)) {
            if ('left' in originalControl) relativeControl['down'] = true;
            if ('right' in originalControl) relativeControl['up'] = true;
        } else if (movesRight.call(this)) {
            if ('left' in originalControl) relativeControl['up'] = true;
            if ('right' in originalControl) relativeControl['down'] = true;
        } else if (movesUp.call(this)) {
            if ('left' in originalControl) relativeControl['left'] = true;
            if ('right' in originalControl) relativeControl['right'] = true;
        } else if (movesDown.call(this)) {
            if ('left' in originalControl) relativeControl['right'] = true;
            if ('right' in originalControl) relativeControl['left'] = true;
        }

        return relativeControl;
    };
}

// brutal, comment out if you want the simple control
player.control = relativeControl();

function drawTail() {
    this.past.forEach(function (coordinate) {
        var tailBall = {
            color: this.color,
            r: this.r,
            position: {
                x: coordinate.x,
                y: coordinate.y
            }
        };
        drawBall.call(tailBall);

    }, this);
}
player.draw = function () {
    drawTail.call(this);
    drawBall.call(this);
    drawFace.call(this);
}

function drawFace() {
    context.fillStyle = '#101010';
    context.beginPath();
    context.arc(this.position.x + this.r / 2, this.position.y, 2, 0, Math.PI * 2);
    context.fill();
    context.closePath();
    context.beginPath();
    context.arc(this.position.x - this.r / 2, this.position.y, 2, 0, Math.PI * 2);
    context.fill();
    context.closePath();
}

logic.name = "wurmspringen";
logic.description = 'Wurmspringen! Hit green balls and avoid red ones and your own tail. Accelerate worm relative to current direction by using left and right cursor keys.'

function addToPast() {
    this.past.push({x: this.position.x, y: this.position.y});
    // let the tail grow with each ball caught
    if (this.past.length > this.tailLength + logic.ballsCaught) {
        this.past.splice(0, 1);
    }
}
