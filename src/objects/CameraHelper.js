import Phaser from 'phaser'

export default class extends Phaser.Sprite {
    scaleFactor = 1

    constructor(game, x=0, y=0) {
        super(game, x, y)
        this.game.camera.bounds = null
        this.game.camera.follow(this)

        this.game.input.mouse.mouseWheelCallback = ::this.onScroll
    }

    update() {
        this.checkScroll(this.game.camera)
        this.checkPan(this)
    }

    onScroll() {
        let zoom = 1.5 ** this.game.input.mouse.wheelDelta
        let newScale = this.scaleFactor * zoom
        if (newScale > 0.01 && newScale < 3)
            this.scaleFactor = newScale
    }

    checkScroll(camera) {
        if (this.prevScale && this.prevScale !== this.scaleFactor)
            camera.scale.set(this.scaleFactor)
        this.prevScale = this.scaleFactor
    }

    checkPan(point) {
        let pointer = this.game.input.activePointer
        if (pointer.isDown) {
            if (this.origDragPoint) {
                point.x += (this.origDragPoint.x - pointer.position.x) / this.scaleFactor
                point.y += (this.origDragPoint.y - pointer.position.y) / this.scaleFactor
            }
            this.origDragPoint = pointer.position.clone()
        }
        else
            this.origDragPoint = undefined
    }
}
