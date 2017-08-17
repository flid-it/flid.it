import Phaser, {Point} from 'phaser'
import Node from '../sprites/Node'
import {rand} from '../utils'

export default class extends Phaser.State {
    scaleFactor = 1

    init() {
    }

    preload() {
    }

    create() {
        this.game.input.mouse.mouseWheelCallback = ::this.onScroll
        this.game.stage.backgroundColor = '#222'
        this.game.camera.bounds = null

        this.nodes = []

        for (; this.nodes.length < 100;) {
            let x = rand.integer(-1000, 1000)
            let y = rand.integer(-1000, 1000)

            let p = new Point(x, y)
            let fail = false
            for (let n of this.nodes) {
                if (Point.distance(n.position, p) < 100) {
                    fail = true
                    break
                }
            }
            if (fail)
                continue

            let node = new Node({game: this.game, x: x, y: y})
            this.game.add.existing(node)
            this.nodes.push(node)
        }
    }

    update() {
        this.checkScroll(this.game.camera)
        this.checkPan(this.game.camera)
    }

    render() {
    }

    checkScroll(camera) {
        if (this.prevScale && this.prevScale !== this.scaleFactor)
            camera.scale.set(this.scaleFactor)
        this.prevScale = this.scaleFactor
    }

    checkPan(camera) {
        let pointer = this.game.input.activePointer
        if (pointer.isDown) {
            if (this.origDragPoint) {
                camera.x += this.origDragPoint.x - pointer.position.x
                camera.y += this.origDragPoint.y - pointer.position.y
            }
            this.origDragPoint = pointer.position.clone()
        }
        else {
            delete this.origDragPoint
        }
    }

    onScroll() {
        let delta = this.game.input.mouse.wheelDelta * 0.05
        console.log(this.scaleFactor)
        if (this.scaleFactor + delta > 0.05 && this.scaleFactor + delta < 3)
            this.scaleFactor += delta
    }
}
