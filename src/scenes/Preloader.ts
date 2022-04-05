import Phaser from "phaser"
import TextureKeys from "../consts/TextureKeys"
import SceneKeys from "../consts/SceneKeys"
import AnimationKeys from "../consts/AnimationKey"

export default class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader")
  }

  preload() {
    this.load.image(TextureKeys.Background, "bg_repeat_340x640.png")
    this.load.image(TextureKeys.MouseHole, "object_mousehole.png")
    this.load.image(TextureKeys.Window1, "object_window1.png")
    this.load.image(TextureKeys.Window2, "object_window2.png")
    this.load.image(TextureKeys.Bookcase1, "object_bookcase1.png")
    this.load.image(TextureKeys.Bookcase2, "object_bookcase2.png")
    this.load.image(TextureKeys.LaserEnd, "object_laser_end.png")
    this.load.image(TextureKeys.LaserMiddle, "object_laser.png")
    // made using TexturPacker
    this.load.atlas(TextureKeys.RocketMouse, "character.png", "character.json")
  }

  create() {
    this.anims.create({
      key: AnimationKeys.RocketMouseRun,
      frames: this.anims.generateFrameNames(TextureKeys.RocketMouse, {
        start: 1,
        end: 4,
        prefix: "rocketmouse_run",
        zeroPad: 2,
        suffix: ".png",
      }),
      frameRate: 10,
      repeat: -1,
    })

    this.anims.create({
      key: AnimationKeys.RocketMouseFall,
      frames: [
        { key: TextureKeys.RocketMouse, frame: "rocketmouse_fall01.png" },
      ],
    })

    this.anims.create({
      key: AnimationKeys.RocketMouseFly,
      frames: [
        { key: TextureKeys.RocketMouse, frame: "rocketmouse_fly01.png" },
      ],
    })

    this.anims.create({
      key: AnimationKeys.RocketFlamesOn,
      frames: this.anims.generateFrameNames(TextureKeys.RocketMouse, {
        start: 1,
        end: 2,
        prefix: "flame",
        suffix: ".png",
      }),
      frameRate: 10,
      repeat: -1,
    })

    this.anims.create({
      key: AnimationKeys.RocketMouseDead,
      frames: this.anims.generateFrameNames(TextureKeys.RocketMouse, {
        start: 1,
        end: 2,
        prefix: "rocketmouse_dead",
        zeroPad: 2,
        suffix: ".png",
      }),
      frameRate: 10,
    })

    this.scene.start(SceneKeys.Game)
  }
}
