/**
 * Typescript-based variant of Olli Zeigermann's Game Engine
 * Nils Hartmann (nils@nilshartmann.net)
 */
/// <reference path="../ext/waa.d.ts" />
var eighties;
(function (eighties) {
	(function (lib) {
		(function (io) {
			// -----------------------------------------------------------------------------------------------------------
			// --- Canvas
			// -----------------------------------------------------------------------------------------------------------
			io.canvas;
			io.context;

			function fullsizeCanvas() {
				io.canvas.width = window.innerWidth;
				io.canvas.height = window.innerHeight;

				window.addEventListener("orientationchange", function () {
					io.canvas.width = window.innerWidth;
					io.canvas.height = window.innerHeight;
				}, false);
			}

			io.fullsizeCanvas = fullsizeCanvas;

			// -----------------------------------------------------------------------------------------------------------
			// --- Control
			// -----------------------------------------------------------------------------------------------------------
			/**
			 * Returns a Control representing the current keyboard state
			 * @return {Control}
			 */
			function control() {
				return keyboardObserver.control();
			}

			io.control = control;

			// -----------------------------------------------------------------------------------------------------------
			// --- Sound
			// -----------------------------------------------------------------------------------------------------------
			io.soundManager;

			var SoundManager = (function () {
				function SoundManager() {
					try {
						if (webkitAudioContext || AudioContext) {
							this.audioContext = new (webkitAudioContext || AudioContext)();
						}
					} catch (e) {
						console.warn('Web Audio API is not supported in this browser');
						console.dir(e);
					}
				}

				SoundManager.prototype.createOscillator = function (frequency) {
					var oscillator = this.audioContext.createOscillator();
					oscillator.type = oscillator.SQUARE;
					oscillator.frequency.value = frequency; // in hertz

					//    Create a gain node.
					var gainNode = this.audioContext.createGain();

					// Connect the source to the gain node.
					oscillator.connect(gainNode);

					// Connect the gain node to the destination.
					gainNode.connect(this.audioContext.destination);

					// Reduce the volume.
					gainNode.gain.value = 0.1;

					return oscillator;
				};

				SoundManager.prototype.playSoundGood = function (frequency) {
					if (this.audioContext) {
						frequency = frequency || 440;
						var oscillator = this.createOscillator(frequency);
						oscillator.start(this.audioContext.currentTime); // play now
						oscillator.stop(this.audioContext.currentTime + 0.1); // seconds
					}
				};

				SoundManager.prototype.playSoundBad = function (frequency) {
					if (this.audioContext) {
						frequency = frequency || 55;
						var oscillator = this.createOscillator(frequency);
						oscillator.type = oscillator.SAWTOOTH;
						oscillator.start(this.audioContext.currentTime); // play now
						oscillator.stop(this.audioContext.currentTime + 0.5); // seconds
					}
				};
				return SoundManager;
			})();
			io.SoundManager = SoundManager;

			// -----------------------------------------------------------------------------------------------------------
			// --- Internal
			// -----------------------------------------------------------------------------------------------------------
			var KeyboardObserver = (function () {
				function KeyboardObserver() {
					var _this = this;
					this.pressed = {};
					window.onkeydown = function (e) {
						if (e.keyCode === 40 || e.keyCode === 38 || e.keyCode === 37 || e.keyCode === 39 || e.keyCode === 32) {
							e.preventDefault();
						}
						_this.pressed[e.keyCode] = true;
					};

					window.onkeyup = function (e) {
						delete _this.pressed[e.keyCode];
					};
				}

				KeyboardObserver.prototype.control = function () {
					return {
						up: 38 in this.pressed,
						down: 40 in this.pressed,
						left: 37 in this.pressed,
						right: 39 in this.pressed,
						esc: 27 in this.pressed
					};
				};
				return KeyboardObserver;
			})();

			var keyboardObserver = new KeyboardObserver();

			(function () {
				console.log("Initializing Canvas...");
				io.canvas = document.getElementById('game');
				io.context = io.canvas.getContext('2d');

				window.addEventListener('load', function () {
					console.log("Initializing Sound...");
					io.soundManager = new SoundManager();
				}, false);
			}());
		})(lib.io || (lib.io = {}));
		var io = lib.io;
	})(eighties.lib || (eighties.lib = {}));
	var lib = eighties.lib;
})(eighties || (eighties = {}));
//# sourceMappingURL=io.js.map
