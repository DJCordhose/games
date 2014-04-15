/**
 * Nils Hartmann (nils@nilshartmann.net)
 */
/// <reference path="../lib/io.ts" />
/// <reference path="../lib/game.ts" />
/// <reference path="bricks.ts" />

import io = eighties.lib.io;
import game = eighties.lib.game;
import bricks = eighties.bricks;

console.log("STARTE ... .");

var simpleGame = new bricks.BricksGame();

simpleGame.start();