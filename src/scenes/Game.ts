import Phaser from "phaser"
import TextureKeys from "../consts/TextureKeys"
import RocketMouse from "../game/RocketMouse"
import LaserObstacle from "../game/LaserObstacle"

export default class Game extends Phaser.Scene {
  private background!: Phaser.GameObjects.TileSprite
  // Mousehole
  private mouseHole!: Phaser.GameObjects.Image
  private wrapMouseHole() {
    const scrollX = this.cameras.main.scrollX
    const rightEdge = scrollX + this.scale.width

    if (this.mouseHole.x + this.mouseHole.width < scrollX) {
      this.mouseHole.x = Phaser.Math.Between(rightEdge + 100, rightEdge + 1000)
    }
  }
  // Windows
  private window1!: Phaser.GameObjects.Image
  private window2!: Phaser.GameObjects.Image
  private wrapWindows() {
    const scrollX = this.cameras.main.scrollX
    const rightEdge = scrollX + this.scale.width

    let width = this.window1.width * 2
    if (this.window1.x + width < scrollX) {
      this.window1.x = Phaser.Math.Between(
        rightEdge + width,
        rightEdge + width + 800
      )
      const overlap = this.bookcases.find((bc) => {
        return Math.abs(this.window1.x - bc.x) <= this.window1.width
      })

      this.window1.visible = !overlap
    }

    width = this.window2.width
    if (this.window2.x + width < scrollX) {
      this.window2.x = Phaser.Math.Between(
        this.window1.x + width,
        this.window1.x + width + 800
      )
      const overlap = this.bookcases.find((bc) => {
        return Math.abs(this.window2.x - bc.x) <= this.window2.width
      })

      this.window2.visible = !overlap
    }
  }
  // Bookcases
  private bookcase1!: Phaser.GameObjects.Image
  private bookcase2!: Phaser.GameObjects.Image
  private wrapBookcase() {
    const scrollX = this.cameras.main.scrollX
    const rightEdge = scrollX + this.scale.width

    let width = this.bookcase1.width * 2
    if (this.bookcase1.x + width < scrollX) {
      this.bookcase1.x = Phaser.Math.Between(
        rightEdge + width,
        rightEdge + width + 800
      )
      const overlap = this.windows.find((win) => {
        return Math.abs(this.bookcase1.x - win.x) <= win.width
      })
      this.bookcase1.visible = !overlap
    }

    width = this.bookcase2.width
    if (this.bookcase2.x + width < scrollX) {
      this.bookcase2.x = Phaser.Math.Between(
        this.bookcase1.x + width,
        this.bookcase1.x + width + 800
      )
      const overlap = this.windows.find((win) => {
        return Math.abs(this.bookcase2.x - win.x) <= win.width
      })
      this.bookcase2.visible = !overlap
    }
  }
  // Object arrays
  private bookcases: Phaser.GameObjects.Image[] = []
  private windows: Phaser.GameObjects.Image[] = []
  // Laser obstacle
  private laserObstacle!: LaserObstacle
  private wrapLaserObstacle() {
    const scrollX = this.cameras.main.scrollX
    const rightEdge = scrollX + this.scale.width

    const body = this.laserObstacle.body as Phaser.Physics.Arcade.StaticBody

    const width = body.width
    if (this.laserObstacle.x + width < scrollX) {
      this.laserObstacle.x = Phaser.Math.Between(
        rightEdge + width,
        rightEdge + width + 1000
      )
      this.laserObstacle.y = Phaser.Math.Between(0, 300)

      body.position.x = this.laserObstacle.x + body.offset.x
      body.position.y = this.laserObstacle.y
    }
  }
  // Handle Collision
  private hasCollided = false
  private handleOverlapLaser(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    const mouse = obj2 as RocketMouse
    mouse.kill()
    this.hasCollided = true
  }
  // Coins
  private coins!: Phaser.Physics.Arcade.StaticGroup
  private spawnCoins() {
    this.coins.children.each((child) => {
      const coin = child as Phaser.Physics.Arcade.Sprite
      this.coins.killAndHide(coin)
      coin.body.enable = false
    })

    const scrollX = this.cameras.main.scrollX
    const rightEdge = scrollX + this.scale.width

    let x = rightEdge + 100

    const numCoins = Phaser.Math.Between(1, 20)

    for (let i = 0; i < numCoins; ++i) {
      const coin = this.coins.get(
        x,
        Phaser.Math.Between(100, this.scale.height - 100),
        TextureKeys.Coin
      ) as Phaser.Physics.Arcade.Sprite

      coin.setVisible(true)
      coin.setActive(true)

      const body = coin.body as Phaser.Physics.Arcade.StaticBody
      body.setCircle(body.width * 0.5)
      body.enable = true

      body.updateFromGameObject()

      x += coin.width * 1.5
    }
  }
  private handleCollectCoin(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    const coin = obj2 as Phaser.Physics.Arcade.Sprite

    this.coins.killAndHide(coin)

    coin.body.enable = false

    if (!this.hasCollided) {
      this.score += 1
      this.scoreLabel.text = `Score: ${this.score}`
    }
  }
  // Score
  private scoreLabel!: Phaser.GameObjects.Text
  private score = 0
  // Mouse
  private mouse!: RocketMouse
  // Teleport backwards
  private teleportBackwards() {
    const scrollX = this.cameras.main.scrollX
    const maxX = 2380

    if (scrollX > maxX) {
      this.mouse.x -= maxX
      this.mouseHole.x -= maxX

      this.windows.forEach((win) => {
        win.x -= maxX
      })

      this.bookcases.forEach((bc) => {
        bc.x -= maxX
      })

      this.laserObstacle.x -= maxX
      const laserBody = this.laserObstacle
        .body as Phaser.Physics.Arcade.StaticBody
      laserBody.x -= maxX

      this.spawnCoins()

      this.coins.children.each((child) => {
        const coin = child as Phaser.Physics.Arcade.Sprite
        if (!coin.active) {
          return
        }

        coin.x -= maxX
        const body = coin.body as Phaser.Physics.Arcade.StaticBody
        body.updateFromGameObject()
      })
    }
  }

  constructor() {
    super("game")
  }

  init() {
    this.score = 0
    this.hasCollided = false
  }

  preload() {}

  create() {
    const { width, height } = this.scale

    // add background as a tileSprite instead of an image
    this.background = this.add
      .tileSprite(0, 0, width, height, TextureKeys.Background)
      .setOrigin(0)
      .setScrollFactor(0, 0)

    this.mouseHole = this.add.image(
      Phaser.Math.Between(900, 1500),
      501,
      TextureKeys.MouseHole
    )

    this.window1 = this.add.image(
      Phaser.Math.Between(900, 1300),
      200,
      TextureKeys.Window1
    )

    this.window2 = this.add.image(
      Phaser.Math.Between(1600, 2000),
      200,
      TextureKeys.Window2
    )

    this.windows = [this.window1, this.window2]

    this.bookcase1 = this.add
      .image(Phaser.Math.Between(2200, 2700), 580, TextureKeys.Bookcase1)
      .setOrigin(0.5, 1)

    this.bookcase2 = this.add
      .image(Phaser.Math.Between(2900, 3400), 580, TextureKeys.Bookcase2)
      .setOrigin(0.5, 1)

    this.bookcases = [this.bookcase1, this.bookcase2]

    this.laserObstacle = new LaserObstacle(this, 900, 100)
    this.add.existing(this.laserObstacle)

    this.coins = this.physics.add.staticGroup()
    this.spawnCoins()

    this.mouse = new RocketMouse(this, width * 0.5, height - 30)
    this.add.existing(this.mouse)

    const body = this.mouse.body as Phaser.Physics.Arcade.Body
    body.setCollideWorldBounds(true)
    body.setVelocityX(200)

    this.physics.world.setBounds(0, 0, Number.MAX_SAFE_INTEGER, height - 55)

    this.cameras.main.startFollow(this.mouse)
    this.cameras.main.setBounds(0, 0, Number.MAX_SAFE_INTEGER, height)

    this.physics.add.overlap(
      this.laserObstacle,
      this.mouse,
      this.handleOverlapLaser,
      undefined,
      this
    )

    this.physics.add.overlap(
      this.coins,
      this.mouse,
      this.handleCollectCoin,
      undefined,
      this
    )

    this.scoreLabel = this.add
      .text(10, 10, `Score: ${this.score}`, {
        fontSize: "24px",
        color: "#080808",
        backgroundColor: "#f8e71c",
        shadow: { fill: true, blur: 0, offsetY: 0 },
        padding: { left: 15, right: 15, top: 10, bottom: 10 },
      })
      .setScrollFactor(0)
  }

  update(t: number, td: number) {
    this.wrapMouseHole()
    this.wrapWindows()
    this.wrapBookcase()
    this.wrapLaserObstacle()

    this.background.setTilePosition(this.cameras.main.scrollX)

    this.teleportBackwards()
  }
}
