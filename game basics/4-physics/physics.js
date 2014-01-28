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

function ballsCollide(object1, object2) {
    // a^2 + c^2 = c^2
    var a = object2.position.x - object1.position.x;
    var b = object2.position.y - object1.position.y;
    var c = object1.r + object2.r;
    return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)) < c;
}

