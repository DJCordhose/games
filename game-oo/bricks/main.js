/*
 var game = new Game();
 createBricks(game, 7, 10);

 game.addObject(new Player());
 game.start();
 */


function createBricks(game, rows, cols) {

	var sizeRequired = cols * 80;
	var width = ((io.canvas.width - sizeRequired - 10) / (cols - 1)) + 80;

	var allBricks = [];

	for (var row = 0; row < rows; row++) {
		for (var col = 0; col < cols; col++) {
			var x = 5 + (col * width);
			var y = 70 + (row * 40);
			var r = 255 - (row * 10);
			var g = 0 + (row * 30);
			var brick = new bricks.Brick(x, y, r, g, 0);
			game.addObject(brick);
			allBricks.push(brick);
		}
	}

	return allBricks;
}

// Create Board
var bricksGame = new bricks.BricksGame();

// Create A Player
var player = new bricks.Player();
// Create Bricks
var allBricks = createBricks(bricksGame, 5, 7);

// Create The Jumping Ball
var ball = new bricks.MovingBall(
	bricksGame,
	player,
	allBricks,
	{position: {x: (io.canvas.width - 10) / 2, y: 300}, r: 10, color: 'blue'});

bricksGame.addObject(bricksGame);
bricksGame.addObject(player);
bricksGame.addObject(ball);


bricksGame.start();