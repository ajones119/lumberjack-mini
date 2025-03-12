import { Actor, Animation, clamp, Collider, CollisionContact, CollisionType, Color, Engine, EventEmitter, Font, GameEvent, Keys, Label, Side, SpriteSheet, vec } from "excalibur";
import { Resources } from "../resources";
import { Ground } from "./ground";
import { Config } from "../config";
import { Tree } from "./tree";
import { Score } from "../ui/Score";

export class PlayerDamagedEvent extends GameEvent<Player> {
  constructor(public target: Player) {
    super();
  }
}

export class ScoreEvent extends GameEvent<Player> {
    score: number = 0;
    constructor(score: number) {
        super();
        this.score = score;
    }
}

type PlayerEvents = {
  playerDamaged: PlayerDamagedEvent;
  score: ScoreEvent;
}

type Direction = "left" | "right" | "idle";

export class Player extends Actor {
  //state
  public events = new EventEmitter<ex.ActorEvents & PlayerEvents>();
  direction: Direction = "idle";
  isJumping = false;
  isGrounded = false;
  isAttacking = false;
  health = 10;

  maxHorizontalVelocity = Config.MaxSpeed;
  horizontalVelocityIncrement = Config.xVelocity;
  jumpHeight = Config.yVelocity;

  walkAnimation!: Animation;
  idleAnimation!: Animation;
  jumpAnimation!: Animation;
  runAnimation!: Animation;

  attack1Animation!: Animation;

  scoreLabel = new Score(0);

  constructor(engine: Engine) {
    super({
      name: 'Player',
      pos: vec(200, engine.screen.height - Config.GroundHeight - 240),
      width: 48,
      height: 62,
      color: Color.Red,
      collisionType: CollisionType.Active
    });
  }

  override onInitialize(engine: Engine): void {
    const spriteSheetIdle = SpriteSheet.fromImageSource({
      image: Resources.LumberjackIdle,
      grid: {
          rows: 1,
          columns: 4,
          spriteWidth: 48,
          spriteHeight: 48,
      }
  });
  this.idleAnimation = Animation.fromSpriteSheet(
      spriteSheetIdle,
      [0, 1, 2, 3],
      Config.PlayerAnimationSpeed
  );
  this.graphics.add('idle', this.idleAnimation);

  const spriteSheetWalk = SpriteSheet.fromImageSource({
    image: Resources.LumberjackWalk,
    grid: {
        rows: 1,
        columns: 6,
        spriteWidth: 48,
        spriteHeight: 48,
    }
  });
  this.walkAnimation = Animation.fromSpriteSheet(
      spriteSheetWalk,
      [0, 1, 2, 3, 4, 5],
      Config.PlayerAnimationSpeed
  );
  this.graphics.add('walk', this.walkAnimation);

  const spriteSheetRun = SpriteSheet.fromImageSource({
    image: Resources.LumberjackRun,
    grid: {
        rows: 1,
        columns: 6,
        spriteWidth: 48,
        spriteHeight: 48,
    }
  });
  this.runAnimation = Animation.fromSpriteSheet(
    spriteSheetRun,
      [0, 1, 2, 3, 4, 5],
      Config.PlayerAnimationSpeed
  );
  this.graphics.add('run', this.runAnimation)

  const spriteSheetJump = SpriteSheet.fromImageSource({
    image: Resources.LumberjackJump,
    grid: {
        rows: 1,
        columns: 6,
        spriteWidth: 48,
        spriteHeight: 48,
    }
  });
  this.jumpAnimation = Animation.fromSpriteSheet(
    spriteSheetJump,
      [0, 1, 2, 3, 4, 5],
      Config.PlayerAnimationSpeed
  );
  this.graphics.add('jump', this.jumpAnimation)

  const spriteSheetAttack1 = SpriteSheet.fromImageSource({
    image: Resources.LumberjackAttack1,
    grid: {
        rows: 1,
        columns: 6,
        spriteWidth: 48,
        spriteHeight: 48,
    }
  });
  this.attack1Animation = Animation.fromSpriteSheet(
    spriteSheetAttack1,
      [0, 1, 2, 3, 4, 5],
      Config.PlayerAttackAnimationSpeed
  );
  this.graphics.add('attack', this.attack1Animation)

  this.graphics.use('idle')

    engine.input.pointers.primary.on('down', () => {
      this.attack();
    });

    engine.add(this.scoreLabel);

    this.events.on('score', (event) => {
      this.scoreLabel.addScore(event.score);
    });
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    // Put any update logic here runs every frame before Actor builtins
    let dt = elapsedMs / 1000; // Convert ms to seconds

    //handle Gravity
    if (this.isGrounded) {
      this.vel.y = 0;
    } else {
      this.vel.y += Config.Gravity * dt;
    }
    
    if (engine.input.keyboard.isHeld(Keys.Right) || engine.input.keyboard.isHeld(Keys.D)) {
      this.vel.x += this.horizontalVelocityIncrement;
      this.scale.x = 1;
    } else if (engine.input.keyboard.isHeld(Keys.Left) || engine.input.keyboard.isHeld(Keys.A)) {
      this.vel.x += this.horizontalVelocityIncrement * -1;
      this.scale.x = -1;

      if (this.pos.x >= engine.drawWidth) {
        this.vel.x = 0;
      }

    } else if (this.isGrounded) {
      // handle Friction
      this.vel.x *= Config.Friction;
    }

    this.vel.x = clamp(this.vel.x, -this.maxHorizontalVelocity, this.maxHorizontalVelocity);

    
    if (engine.input.keyboard.wasPressed(Keys.Space) && !Math.abs(this.vel.y)) {
      this.vel.y += this.jumpHeight * -1;
      this.isGrounded = false;
    }

    this.handleAnimation();
  }

  //this function looks at the entire state  and determines what animation should be playing
  handleAnimation() {
    if (this.isAttacking) {
      this.graphics.use(this.attack1Animation);
      return;
    } else if (this.isJumping) {
      this.graphics.use('jump');
      return;
    } else if (Math.abs(this.vel.x) < 20) {
      this.graphics.use('idle');
      return;
    }else if (Math.abs(this.vel.x) < 250) {
      this.graphics.use('walk');
      return;
    } else if (Math.abs(this.vel.x) > 250) {
      this.graphics.use('run');
      return;
    }
  }
  private collidedWith: {[key: number]: Tree} = {};
  attack() {
    let scoredInAttack = 0;
    this.actions.callMethod(() => {
      this.isAttacking = true;
      for (const tree of Object.values(this.collidedWith)) {
        scoredInAttack += tree.takeDamage(20);
      }
    }).delay(300).callMethod(() => {
      this.isAttacking = false;
        if (scoredInAttack > 0) {
        const jitter = Math.random() * 50 - 25;
        const label = new Label({
            text: `+${scoredInAttack}`,
            x: this.pos.x + jitter,
            y: this.pos.y - 20,
            z: 1,
            font: new Font({
                size: 24,
                color: Color.Blue
            })
        });

        this.scene?.add(label);
        label.actions.moveBy(0, -50, 20).die();
      }
      this.events.emit('score', new ScoreEvent(scoredInAttack))
    });
  }

  public takeDamage(damage: number) {
    this.health -= damage;
    if (this.health <= 0) {
      this.actions.fade(0, 1000).die();
    } else {
      //blink and tint red
      this.actions.flash(Color.Red, 400);
    }
    this.events.emit('playerDamaged', new PlayerDamagedEvent(this));
  }

  override onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
    // Called when a pair of objects are in contact
    if (other.owner instanceof Ground) {
      this.vel.y = 0;
      //this.pos.y = 500;
      this.isJumping = false;
      this.isGrounded = true;
    } else if (other.owner instanceof Tree) {
      this.collidedWith[other.owner.id] = other.owner;
    }
  }

  override onCollisionEnd(self: Collider, other: Collider, side: Side, lastContact: CollisionContact): void {
    // Called when a pair of objects separates
    if (other.owner instanceof Tree) {
      delete this.collidedWith[other.owner.id];
    }
  }
}
