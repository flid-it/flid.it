import Phaser from 'phaser'
import {rand} from '../utils'

export default class extends Phaser.Sprite {
    rotateSpeed = rand.real(-0.3, 0.3)

    constructor({game, x, y}) {
        super(game, x, y, 'node')
        this.anchor.setTo(0.5)
        this.width = this.height = 32
        this.scale.set(this.scale.x * rand.real(0.5, 1.5))
    }

    update() {
        this.angle += this.rotateSpeed
    }
}
