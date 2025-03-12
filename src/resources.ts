import { ImageSource, Loader } from "excalibur";

// Define resources
export const Resources = {
  Background: new ImageSource("./images/mountain-bg.jpg"),
  GroundImage: new ImageSource("./images/ground.png"),
  LumberjackIdle: new ImageSource("./images/woodcutter/Woodcutter_idle.png"),
  LumberjackRun: new ImageSource("./images/woodcutter/Woodcutter_run.png"),
  LumberjackWalk: new ImageSource("./images/woodcutter/Woodcutter_walk.png"),
  LumberjackJump: new ImageSource("./images/woodcutter/Woodcutter_jump.png"),
  LumberjackAttack1: new ImageSource("./images/woodcutter/Woodcutter_attack1.png"),

  TreeYoung: new ImageSource("./images/tree/young.png"),
  TreeMature: new ImageSource("./images/tree/mature.png"),
  TreeDead: new ImageSource("./images/tree/dead.png"),

  WolfWalk: new ImageSource("./images/wolf/wolfWalk.png"),
  WolfAttack: new ImageSource("./images/wolf/wolfAttack.png"),

  Hearts: [
    new ImageSource("./images/hearts/heartEmpty.png"),
    new ImageSource("./images/hearts/heartHalf.png"),
    new ImageSource("./images/hearts/heartFull.png"),
  ],

  FirTreeLife: [
    new ImageSource("./images/tree/firTree/fir_tree_start.png"),
    new ImageSource("./images/tree/firTree/fir_tree_2.png"),
    new ImageSource("./images/tree/firTree/fir_tree_3.png"),
    new ImageSource("./images/tree/firTree/fir_tree_4.png"),
    new ImageSource("./images/tree/firTree/fir_tree_5.png"),
    new ImageSource("./images/tree/firTree/fir_tree_end.png"),
  ],
} as const;

// Build a loader
export const loader = new Loader();

// Add all images to the loader (now simpler)
for (const res of Object.values(Resources)) {
  if (res instanceof ImageSource) {
    loader.addResource(res);
  } else if (Array.isArray(res)) {
    res.forEach((img) => loader.addResource(img));
  }
}
