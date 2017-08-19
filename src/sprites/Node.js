import Phaser from 'phaser'
import {rand, getNearestNodes} from '../utils'

export default class Node extends Phaser.Sprite {
    static nodes = []

    rotateSpeed = rand.real(-0.3, 0.3)
    linked = []

    constructor(game, x, y) {
        super(game, x, y, 'node')
        this.anchor.setTo(0.5)
        this.width = this.height = 32
        this.scale.set(this.scale.x * rand.real(0.5, 1.5))
    }

    update() {
        this.angle += this.rotateSpeed
    }

    getNearest(nodes, n=1) {
        return getNearestNodes(this.x, this.y, nodes, n)
    }

    addLinkTo(node) {
        return this.linked.push(node)
    }

    linkedWith(node) {
        return this.linked.includes(node)
    }
}
