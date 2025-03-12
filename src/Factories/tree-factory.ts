import { Random, Timer, vec } from "excalibur";
import { MyLevel } from "../level";
import { Tree } from "../Actors/tree";
import { Config } from "../config";

export class TreeFactory {
    private timer: Timer;
    constructor(
        private level: MyLevel,
        private random: Random,
        intervalMs: number
    ) {
        this.timer = new Timer({
            interval: intervalMs,
            repeats: true,
            action: () => {
                let trees = 0;

                for (let actor of this.level.actors) {
                    if (actor instanceof Tree) {
                        trees++;
                    }
                }

                if (trees < 50) {
                    this.spawnTree();
                }
            }
        });
        this.level.add(this.timer);
    }

    spawnTree() {
        const randomTreePosition = this.random.floating(this.level.engine.screen.resolution.width, 60 )
        const tree = new Tree(
            vec(randomTreePosition, this.level.engine.screen.resolution.height - Config.GroundHeight),
            this.level.engine
        )
        this.level.add(tree);
    }

    start() {
        this.timer.start();
    }

    stop() {
        this.timer.cancel()
    }

     reset() {
            for (const actor of this.level.actors) {
                if (actor instanceof Tree)
                    actor.kill()
                
            }
        }
}