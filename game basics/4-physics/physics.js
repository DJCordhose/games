var player = {
    velocity: {
        x: 0,
        y: 0
    },
    position: {
        x: 100,
        y: 100
    },
    update: updatePlayer
};


function updatePlayer () {
    // move based on velocity
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // bounce off at borders
    if (this.position.x < this.r) {
        this.position.x = this.r;
        this.velocity.x = -this.velocity.x;
    }
    if (this.position.x >= canvas.width - this.r) {
        this.position.x = canvas.width - this.r;
        this.velocity.x = -this.velocity.x;
    }
    if (this.position.y < this.r) {
        this.position.y = this.r;
        this.velocity.y = -this.velocity.y;
    }
    if (this.position.y >= canvas.height - this.r) {
        this.position.y = canvas.height - this.r;
        this.velocity.y = -this.velocity.y;
    }

    // add gravity
    var gravity = 0.01;
    player.velocity.y += gravity;
}

// http://www.adambrookesprojects.co.uk/project/canvas-collision-elastic-collision-tutorial/
function ballsCollide(object1, object2) {
    var deltaX = object2.position.x - object1.position.x;
    var deltaY = object2.position.y - object1.position.y;
    // a^2 + b^2 = c^2
    var distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
    return distance < object1.r + object2.r;
}

