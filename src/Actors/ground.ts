import { Actor, Color, Engine, vec, Vector } from "excalibur";
import { Resources } from "../resources";
import { Config } from "../config";

export class Ground extends Actor {
    groundSprite = Resources.GroundImage.toSprite();
    constructor(pos: Vector, engine: Engine) {
        super({
            pos,
            anchor: vec(0, 0),
            height: Config.GroundHeight,
            width: engine.canvasWidth,
            color: Color.fromHex('#bd9853'),
            z: 1
        });
    }
}