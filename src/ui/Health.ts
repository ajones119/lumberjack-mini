import { Engine, ScreenElement, vec } from "excalibur";
import { Player } from "../Actors/player";
import { Resources } from "../resources";

export class HealthBar extends ScreenElement {
    private health = 0;
    hearts: ScreenElement[] = [];
    heartFull = Resources.Hearts[2].toSprite();
    heartHalf = Resources.Hearts[1].toSprite();
    heartEmpty = Resources.Hearts[0].toSprite();
    constructor() {
        super({
            x: 50,
            y: 50
        });
    }
    onInitialize(engine: Engine) {
        const scene = engine.currentScene;
        const player = scene.actors.find(a => a instanceof Player) as Player;
        if (player) {
            this.health = player.health;
        }        
        
        this.setHealthBar(engine);

        player.events.on('playerDamaged', (event) => {
            this.health = event.target.health;
            this.setHealthBar(engine);
        });
    }

    private setHealthBar(engine: Engine) {
        // remove all hearts
        this.hearts.forEach(h => h.kill());
        this.hearts = [];

        const isOdd = this.health % 2 === 1;

        // create a health bar;
        for (let i = 0; i < Math.floor(this.health/2); i++) {
            const heart = new ScreenElement({
                x: i * 50 + 25,
                y: this.pos.y,
                scale: vec(0.5, 0.5)
            });

            heart.graphics.use(this.heartFull);
            engine.add(heart);
            this.hearts.push(heart);
        }

        if (isOdd) {
            const heart = new ScreenElement({
                x: this.hearts.length * 50,
                y: this.pos.y,
                scale: vec(0.5, 0.5)
            });

            heart.graphics.use(this.heartHalf);
            engine.add(heart);
            this.hearts.push(heart);
        }
    }
}