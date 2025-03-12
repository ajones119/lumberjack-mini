import { Timer } from "excalibur";
import { MyLevel } from "../level";
import { Wolf } from "../Actors/wolf";

export class WolfFactory {
    private timer: Timer;
    constructor(
        private level: MyLevel,
        intervalMs: number
    ) {
        this.timer = new Timer({
            interval: intervalMs,
            repeats: true,
            action: () => this.spawnWolf()
        });
        this.level.add(this.timer);
    }

    spawnWolf() {
        const wolf = new Wolf(
            this.level.engine
        )

        this.level.add(wolf);
    }

    start() {
        this.timer.start();
    }

    stop() {
        this.timer.cancel()
    }

    reset() {
        for (const actor of this.level.actors) {
            if (actor instanceof Wolf)
                actor.kill()
            
        }
    }
}