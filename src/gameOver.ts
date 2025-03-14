import { Actor, Color, Engine, Font, Label, Scene, SceneActivationContext, vec } from "excalibur";
import { MyLevel } from "./level";

export class GameOverScene extends Scene {
  onInitialize(engine: Engine) {
    // Game Over Label
    const gameOverText = new Label({
      text: "Game Over",
      pos: vec(engine.drawWidth / 2 - 80, engine.drawHeight / 2 - 50),
      font: new Font({
        size: 40,
        color: Color.Red
      })
    });

    // Restart Button
    const restartButton = new Actor({
        pos: vec(engine.drawWidth / 2 - 50, engine.drawHeight / 2 + 20),
        width: 150,
        height: 50,
        color: Color.Black // Background color
    });

    

    // Restart Label (inside the button)
    const restartLabel = new Label({
        text: "Restart",
        pos: vec(0, 0), // Center it inside the button
        font: new Font({
        size: 20,
        color: Color.Red
        })
    });

    restartButton.addChild(restartLabel);

    // Change cursor when hovering
    restartButton.events.on("pointerenter", () => {
        document.body.style.cursor = "pointer";
    });

    restartButton.events.on("pointerleave", () => {
        document.body.style.cursor = "default";
    });

    // Restart button click event
    restartButton.on("pointerup", () => {
        engine.removeScene('start');
        engine.addScene('start', new MyLevel());
        engine.goToScene("start"); // Go back to main level
    });

    this.add(gameOverText);
    this.add(restartButton);
    }

    onActivate() {
        this.engine.backgroundColor = Color.Black;
    }

    onDeactivate(context: SceneActivationContext): void {
        this.clear();
    }
}
