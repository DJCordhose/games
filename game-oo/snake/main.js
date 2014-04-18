io.ready(function() {
    io.fullsizeCanvas();

    var snakeObj = new snake.Snake();
    var snakeGame = new snake.SnakeGame(snakeObj);


    snakeGame.addObject(snakeGame);
    snakeGame.addObject(snakeObj);
    snakeObj.game = snakeGame;

    snakeGame.start();
});

