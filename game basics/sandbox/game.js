var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

// draw a ball
function draw() {
    context.fillStyle = this.color;
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.r, 0, Math.PI * 2);
    context.fill();
    context.closePath();
}