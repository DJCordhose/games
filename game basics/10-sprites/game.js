/*
// adapted from
// http://www.html5canvastutorials.com/labs/html5-canvas-animals-on-the-beach-game-with-kineticjs/
function loadImages(rootUrl, sources, callback) {
    var imagesLoadedCnt = sources.length;
    var images = {};
    for (var index in sources) {
        var name = sources[index];
        var image = new Image();
        image.src = rootUrl + '/' + name + '.png';
        image.onload = function() {
            imagesLoadedCnt--;
            if(imagesLoadedCnt === 0) {
                callback(images);
            }
        };
        images[name] = image;
    }
}

// Credit for the art goes to
// http://www.icons-land.com/
// http://findicons.com/icon/48263/basketball_ball?id=48280
loadImages('images/', ['basketball_ball'], function (images) {

    player.draw = function () {
        var image = images['basketball_ball'];

        var dw = 30, dh = 30,
            dx = this.position.x - dw / 2, dy = this.position.y - dh / 2 + 5,
            sx = 0, sy = 0,
            sw = image.width, sh = image.height;

        // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D.drawImage
        context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
    };
});
*/

// https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement.Image
var image = new Image();
// Credit for the art goes to
// http://www.icons-land.com/
// http://findicons.com/icon/48263/basketball_ball?id=48280
image.src = 'images/basketball_ball.png';
image.onload = function() {
    player.draw = function () {
        var dw = 30, dh = 30,
            dx = this.position.x - dw / 2, dy = this.position.y - dh / 2 + 5,
            sx = 0, sy = 0,
            sw = image.width, sh = image.height;

        // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D.drawImage
        context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
    };
};