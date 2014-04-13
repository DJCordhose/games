io.fullsizeCanvas();

io.loadImages('images/', ['hyptosis_tile-art-batch-1'], function (images) {

    // Credit for the art goes to Hyptosis@gmail.com (http://www.newgrounds.com/art/view/hyptosis/tile-art-batch-1)
//    var green = new game.Sprite({
//        image: images['hyptosis_tile-art-batch-1'],
//        position: {
//            x: 100,
//            y: 100
//        },
//        // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D#drawImage()
//        imageInfo: {
//            sx: 290, sy: 258, sw: 28, sh: 26
//        }
//    });

    var green = new hoverlord.Player(images);
    var hoverlordGame = new hoverlord.HoverlordGame(green);

    hoverlordGame.addObject(hoverlordGame);
    hoverlordGame.addObject(green);
    green.game = hoverlordGame;
    hoverlordGame.start();
})


