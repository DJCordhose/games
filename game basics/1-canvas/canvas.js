var canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var context = canvas.getContext('2d');

var player = {
    r: 10,
    color: 'blue',
    position: {
        x: 100,
        y: 100
    },
    draw: drawBall
};

function drawBall() {
    context.fillStyle = this.color;
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.r, 0, Math.PI * 2);
    context.fill();
    context.closePath();
}

player.draw();
