import { ActionSequence, Actor, Color, Engine, ParallelActions, RotationType, Shape, Timer, vec, Vector } from "excalibur";
import { Config } from "../config";
import { Resources } from "../resources";

export class Tree extends Actor {
    private health = 0;
    private maxHealth = 100;
    private stages = 1;

    constructor(pos: Vector, engine: Engine) {
        super({
            pos,
            color: Color.Green,
            anchor: vec(0.5, 1),
        })

        // max health is an exponential function of the tree's stages
        this.maxHealth =  200;
        this.stages = Resources.FirTreeLife.length - 1;
        this.health = 1;
    }

    override onInitialize(engine: Engine): void {
        const treeImage = Resources.FirTreeLife[0].toSprite();
        treeImage.sourceView.height = Config.TreeHeight;
        treeImage.destSize.height = Config.TreeHeight;
        this.graphics.use(treeImage);


        //timer for heal over time
        const healTimer = new Timer({
            action: () => {
                // should this decrease?
                this.grow(5);
            },
            repeats: true,
            interval: 500
        })

        engine.add(healTimer);
        healTimer.start();

        this.setTreeGraphics();
    }


    private setTreeGraphics() {

        // get the current stage of the tree, based on its health
        const health = this.health < 0 ? 0 : this.health;
        const usedStage = Math.floor((health / this.maxHealth * 1.1) * this.stages);
        const treeImage = Resources.FirTreeLife[usedStage].toSprite();

        this.graphics.use(treeImage);

        //update trees width and height to match the new image
        this.collider.set(Shape.Box(treeImage.width/3, treeImage.height))
    }

    //emit the score based on current tree growth
    // the more growth, the larger the score
    private getScored() {
        const health = this.health < 0 ? 0 : this.health;
        return Math.floor((health / this.maxHealth * 1.1) * this.stages);
    }

    public takeDamage(damage: number): number {
        const scoredPoints = this.getScored();
        this.health -= damage;
        if (this.health <= 0) {
            this.death();

        } else {
            this.shake();
        }

        return scoredPoints;
    }

    public grow(heal: number) {
        this.health += heal;
        if (this.health > this.maxHealth) {
            this.health = this.maxHealth;
        } else {
            //debug  tree healing
            /*const jitter = Math.random() * 50 - 25;
            const label = new Label({
                text: `+${heal}`,
                x: this.pos.x + jitter,
                y: this.pos.y - 20,
                z: 1,
                font: new Font({
                    size: 10,
                    color: Color.Green
                })
            })
    
            this.scene?.add(label);
            label.actions.moveBy(0, -50, 20).die();
            */
            
        }
        this.setTreeGraphics();
    }

    public shake() {
        this.actions.repeat((repeatCtx) => {
            repeatCtx.rotateTo(0.10, 100);
            repeatCtx.rotateTo(-0.10, 100);
        }, 4).rotateTo(0, 100)
    }

    public death() {

        const rotate = new ActionSequence(this, ctx => {
            ctx.rotateTo(Math.PI / 2, Math.PI, RotationType.ShortestPath);
        })

        const fade = new ActionSequence(this, ctx => {
            ctx.fade(0, 1000);
        })

        const drop = new ActionSequence(this, ctx => {
            ctx.moveBy(0, 25, 1000);
        })

        this.actions.runAction(new ParallelActions([rotate, fade, drop])).die();
    }
}

//nex thing is to add wood score and wolves that patrol the forest