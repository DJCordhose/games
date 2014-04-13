io.fullsizeCanvas();

var snakeObj = new snake.Snake();
var snakeGame = new snake.SnakeGame(snakeObj);

snakeGame.addObject(snakeGame);
snakeGame.addObject(snakeObj);
snakeObj.game = snakeGame;

io.loadImages('images/', ['hyptosis_tile-art-batch-1'], function (images) {
    snake.images = images;
    snakeGame.start();
})


