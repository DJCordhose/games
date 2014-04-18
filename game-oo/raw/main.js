io.fullsizeCanvas();

var player = new balls.Player();
var game = new game.SimpleLogic({
    gameName: 'raw',
    description: 'Just an inertia game frame. Accelerate by using cursor keys.'

});

game.addObject(game);
game.addObject(player);

game.start();

