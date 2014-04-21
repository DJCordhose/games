/**
 * Typescript-based variant of Olli Zeigermann's Game Engine
 * Nils Hartmann (nils@nilshartmann.net)
 */
/// <reference path="../../game-ts/ext/waa.d.ts" />

    module eighties.lib.io {

        // Public object
        export var canvas:HTMLCanvasElement;

        export class SoundManager {

            // Public attribute
            loudness: number;
            // Private attribute
            private audioContext: AudioContext;

            constructor(loudness: number) {
                this.loudness = loudness;
                this.audioContext = SoundManager.createContext();
            }

            // Public Method
            play(): void {
            }

            // Static
            private static createContext(): AudioContext {
                return new AudioContext();
            }
        }

                    // Instantiate
                    var soundManager = new SoundManager(100);

                    // Change loudness
                    soundManager.loudness = 200;

                    // Call a method
                    soundManager.play();

                    // Access to private member forbidden
                    soundManager.audioContext = null;




        // Internal class
        class KeyboardObserver {
            // ...
        }

        // Internal object
        var keyboardObserver:KeyboardObserver = new KeyboardObserver();
    }


