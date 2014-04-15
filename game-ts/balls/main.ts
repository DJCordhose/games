/**
 * TypeScript adaption of 'balls' game by Olli Zeigermann
 *
 * Nils Hartmann (nils@nilshartmann.net)
 */
/// <reference path="../lib/io.ts" />
/// <reference path="../lib/game.ts" />
/// <reference path="balls.ts" />
import balls = eighties.balls;
import io = eighties.lib.io;

// Set Canvas to full size of Window
io.fullsizeCanvas();

// Create Player
var player = new balls.Player();

// Create The Game
var ballsGame = new balls.BallsGame(player);

// Start
ballsGame.start();