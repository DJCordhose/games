/**
 * Typescript-based variant of Olli Zeigermann's Game Engine
 * Nils Hartmann (nils@nilshartmann.net)
 */
/// <reference path="../ext/waa.d.ts" />

module eighties.lib.io {

	// -----------------------------------------------------------------------------------------------------------
	// --- Canvas
	// -----------------------------------------------------------------------------------------------------------
	export var canvas:HTMLCanvasElement;
	export var context:CanvasRenderingContext2D;

	export function fullsizeCanvas():void {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		window.addEventListener("orientationchange", function () {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		}, false);
	}

	// -----------------------------------------------------------------------------------------------------------
	// --- Control
	// -----------------------------------------------------------------------------------------------------------

	/**
	 * Returns a Control representing the current keyboard state
	 * @return {Control}
	 */
	export function control():Control {
		return keyboardObserver.control();
	}

	export interface Control {
		up: boolean;
		down: boolean;
		left: boolean;
		right: boolean;
		esc: boolean;
	}
	// -----------------------------------------------------------------------------------------------------------
	// --- Sound
	// -----------------------------------------------------------------------------------------------------------
	export var soundManager:SoundManager;

	export class SoundManager {
		private audioContext;

		constructor() {
			try {
				if (webkitAudioContext || AudioContext) {
					this.audioContext = new (webkitAudioContext || AudioContext)();
				}
			}
			catch (e) {
				console.warn('Web Audio API is not supported in this browser');
				console.dir(e);
			}
		}

		private createOscillator(frequency:number) {
			var oscillator = this.audioContext.createOscillator(); // Oscillator defaults to sine wave
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
		}

		playSoundGood(frequency?:number) {
			if (this.audioContext) {
				frequency = frequency || 440;
				var oscillator = this.createOscillator(frequency);
				oscillator.start(this.audioContext.currentTime); // play now
				oscillator.stop(this.audioContext.currentTime + 0.1); // seconds
			}
		}

		playSoundBad(frequency?:number) {
			if (this.audioContext) {
				frequency = frequency || 55;
				var oscillator = this.createOscillator(frequency);
				oscillator.type = oscillator.SAWTOOTH;
				oscillator.start(this.audioContext.currentTime); // play now
				oscillator.stop(this.audioContext.currentTime + 0.5); // seconds
			}
		}
	}


	// -----------------------------------------------------------------------------------------------------------
	// --- Internal
	// -----------------------------------------------------------------------------------------------------------

	class KeyboardObserver {
		private pressed:any = {};

		constructor() {

			window.onkeydown = e => {
				if (e.keyCode === 40 || e.keyCode === 38 || e.keyCode === 37 || e.keyCode === 39 || e.keyCode === 32) {
					e.preventDefault();
				}
				this.pressed[e.keyCode] = true;
			};

			window.onkeyup = e => {
				delete this.pressed[e.keyCode];
			}
		}

		control():Control {
			return {
				up: 38 in this.pressed,
				down: 40 in this.pressed,
				left: 37 in this.pressed,
				right: 39 in this.pressed,
				esc: 27 in this.pressed
			};
		}
	}

	var keyboardObserver:KeyboardObserver = new KeyboardObserver();

	(function () {
		console.log("Initializing Canvas...");
		canvas = <HTMLCanvasElement> document.getElementById('game');
		context = canvas.getContext('2d');


		window.addEventListener('load', function () {
			console.log("Initializing Sound...");
			soundManager = new SoundManager();
		}, false);
	}());
}