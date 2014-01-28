setInterval(loop, 10);

var objects = [];

function loop() {
    objects.forEach(function(object) {
        object.update();
    });
    context.clearRect(0, 0, canvas.width, canvas.height);
    objects.forEach(function(object) {
        object.draw();
    });
}

