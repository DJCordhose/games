io.fullsizeCanvas();

var player = new balls.Player();
var ballsGame = new balls.BallsGame(player);

ballsGame.addObject(ballsGame);
ballsGame.addObject(player);

ballsGame.start();

