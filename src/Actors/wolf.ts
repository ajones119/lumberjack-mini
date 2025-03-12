import { Actor, Animation, Collider, CollisionContact, Color, Engine, Side, SpriteSheet, vec } from "excalibur";
import { Resources } from "../resources";
import { Config } from "../config";
import { Player } from "./player";

export class Wolf extends Actor {
    //state
    direction: "left" | "right" | "idle" = "idle";
    isAttacking = false;
    health = 100;

    walkAnimation!: Animation;
    idleAnimation!: Animation;
    runAnimation!: Animation;

    attackAnimation!: Animation;
    engine: Engine;

    constructor(engine: Engine) {
    super({
        name: 'Wolf',
        pos: vec(64, engine.screen.height - Config.GroundHeight),
        width: 55,
        height: 32,
        color: Color.Red,
        anchor: vec(0.5, 1)
    });
    this.engine = engine;
    }

    override onInitialize(engine: Engine): void {
        const spriteSheet = SpriteSheet.fromImageSource({
            image: Resources.WolfWalk,
            grid: {
                rows: 1,
                columns: 5,
                spriteWidth: 64,
                spriteHeight: 32
            }
        });

        this.walkAnimation = Animation.fromSpriteSheet(
            spriteSheet,
            [0, 1, 2, 3, 4],
            200,
        );

        const spriteSheetAttack = SpriteSheet.fromImageSource({
            image: Resources.WolfAttack,
            grid: {
                rows: 1,
                columns: 5,
                spriteWidth: 64,
                spriteHeight: 32
            }
        });

        this.attackAnimation = Animation.fromSpriteSheet(
            spriteSheetAttack,
            [0, 1, 2, 3, 4],
            200,
        );

        this.graphics.add('walk', this.walkAnimation);
        this.graphics.add('attack', this.attackAnimation);
        this.graphics.use('walk');
        const screenWidth = engine.screen.width;
        this.pos.x = screenWidth / 2;
        this.walkRight(engine);
    }

    private attack(engine: Engine) {
        const isFacingRight = this.scale.x === 1;
        this.actions.clearActions();
        this.actions.callMethod(() => {
            this.isAttacking = true;
            this.graphics.use('attack');
        });

        this.actions.delay(500)

        if (isFacingRight) {
            this.walkRight(engine);
        } else {
            this.walkLeft(engine);
        }
    }

    private walkRight(engine: Engine) {
        const screenWidth = engine.screen.width;
        this.actions.callMethod(() => {
            this.graphics.use('walk');
            this.scale.x = 1;
        }).repeatForever((ctx) => {
            // Move right and face right
                ctx.callMethod(() => {
                    this.scale.x = 1;
                });
                ctx.moveTo(screenWidth - 64, this.pos.y, 100);
            
                // Move left and face left
                ctx.callMethod(() => {
                    this.scale.x = -1;
                });
                ctx.moveTo(64, this.pos.y, 100);
            });
    }

    private walkLeft(engine: Engine) {
        const screenWidth = engine.screen.width;
        this.actions.callMethod(() => {
            this.graphics.use('walk');
            this.scale.x = -1;
        }).repeatForever((ctx) => {
            // Move left and face left
                ctx.callMethod(() => {
                    this.scale.x = -1;
                });
                ctx.moveTo(64, this.pos.y, 100);
            
                // Move right and face right
                ctx.callMethod(() => {
                    this.scale.x = 1;
                });
                ctx.moveTo(screenWidth - 64, this.pos.y, 100);
            });
    }


    onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
       //if the collision is with a player, damage the player
        if (other.owner instanceof Player) {
                other.owner.takeDamage(1);
                this.attack(this.engine);
        }
    }
}