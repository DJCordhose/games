io.fullsizeCanvas();

io.loadImages('images/', ['wurfram'], function (images) {

    var player = new wurfram.Player(images);
    var game = new wurfram.WurframGame(player);

    game.addObject(game);
    game.addObject(player);
    player.game = game;
    game.start();
})


