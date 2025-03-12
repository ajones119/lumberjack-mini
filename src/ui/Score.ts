import { Color, Engine, EventEmitter, Font, GameEvent, Label, ScreenElement, vec } from "excalibur";
import { Player } from "../Actors/player";
import { Resources } from "../resources";

export class Score extends ScreenElement {
    public score = 0;
    label = new Label({
        text: 'Score: 0',
        x: 0,
        y: 0,
        z: 1,
        font: new Font({
        size: 20,
        color: Color.White
        })
    });

    constructor(initialScore: number = 0) {
        super({
            x: 25,
            y: 100
        });
        this.score = initialScore;
    }
    onInitialize(engine: Engine) {
        this.addChild(this.label);
    }

    private setLabel() {
        this.label.text = `score: ${this.score}`
    }

    public setScore(score: number) {
        this.score = score; 
        this.setLabel();
    }

    public addScore(score: number) {
        this.score += score;
        this.setLabel()
    }
}