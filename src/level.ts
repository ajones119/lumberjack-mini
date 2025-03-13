import { Actor, CollisionType, Color, DefaultLoader, Engine, ExcaliburGraphicsContext, Random, Scene, SceneActivationContext, vec } from "excalibur";
import { Player } from "./Actors/player";
import { Ground } from "./Actors/ground";
import { Config } from "./config";
import { TreeFactory } from "./Factories/tree-factory";
import { WolfFactory } from "./Factories/wolf-factory";
import { HealthBar } from "./ui/Health";
import { Resources } from "./resources";


export class MyLevel extends Scene {
    ground!: Ground;
    random = new Random();
    player!: Player;    

    treeFactory!: TreeFactory;
    wolfFactory!: WolfFactory;

    background!: Actor;

    override onInitialize(engine: Engine): void {
    }

    override onActivate(context: SceneActivationContext<unknown>): void {
        console.log('activate')
        this.createScene(this.engine);
    }

    createScene (engine: Engine) {
        console.log('create')
        this.clear();

        console.log('actor', this.player);
        //how many actors re player
        console.log(this.actors.filter(actor => actor instanceof Player).length)
        
        this.background = new Actor({
            pos: vec(engine.drawWidth / 2, engine.drawHeight / 2),
            anchor: vec(0.5, 0.5),
            z: -1 // Ensure it is behind everything
        });
        const backgroundImage = Resources.Background.toSprite({
            height: engine.drawHeight,
            width: engine.drawWidth
        });
        this.background.graphics.use(backgroundImage)
        this.add(this.background)

        const screenWidth = engine.drawWidth;
        const screenHeight = engine.drawHeight;
        const wallThickness = 6;
        const wallColor = Color.Transparent;

        // Create walls
        const walls = [
        // Top wall
            new Actor({
                x: screenWidth / 2,
                y: wallThickness / 2,
                width: screenWidth,
                height: wallThickness,
                color: wallColor,
                collisionType: CollisionType.Fixed
            }),
            // Bottom wall
            new Actor({
                x: screenWidth / 2,
                y: screenHeight - wallThickness / 2,
                width: screenWidth,
                height: wallThickness,
                color: wallColor,
                collisionType: CollisionType.Fixed
            }),
            // Left wall
            new Actor({
                x: wallThickness / 2,
                y: screenHeight / 2,
                width: wallThickness,
                height: screenHeight,
                color: wallColor,
                collisionType: CollisionType.Fixed
            }),
            // Right wall
            new Actor({
                x: screenWidth - wallThickness / 2,
                y: screenHeight / 2,
                width: wallThickness,
                height: screenHeight,
                color: wallColor,
                collisionType: CollisionType.Fixed
            })
        ];

        // Add walls to the game
        walls.forEach(wall => this.add(wall));

        this.player = new Player(engine);
        this.add(this.player); // Actors need to be added to a scene to be drawn
        this.add(new HealthBar());

        this.ground = new Ground(vec(0, engine.screen.drawHeight - Config.GroundHeight), engine)
        this.add(this.ground)
        this.treeFactory = new TreeFactory(this, this.random, Config.TreeInterval);
        this.wolfFactory = new WolfFactory(this, 10000);
        this.treeFactory.start();
        this.wolfFactory.start();

        this.player.events.on('kill', () => {
            this.triggerGameOver();
        })
    }


    triggerGameOver() {
        this.treeFactory.stop();
        this.wolfFactory.stop();
        this.engine.goToScene('gameOver');
    }

    override onPreLoad(loader: DefaultLoader): void {
        // Add any scene specific resources to load
    }

    override onDeactivate(context: SceneActivationContext): void {
        // Called when Excalibur transitions away from this scene
        // Only 1 scene is active at a time
        this.treeFactory.reset();
        this.wolfFactory.reset();
        this.clear();
    }

    override onPreUpdate(engine: Engine, elapsedMs: number): void {
        // Called before anything updates in the scene
    }

    override onPostUpdate(engine: Engine, elapsedMs: number): void {
        // Called after everything updates in the scene
    }

    override onPreDraw(ctx: ExcaliburGraphicsContext, elapsedMs: number): void {
        // Called before Excalibur draws to the screen
    }

    override onPostDraw(ctx: ExcaliburGraphicsContext, elapsedMs: number): void {
        // Called after Excalibur draws to the screen
    }
}