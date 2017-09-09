import Phaser, {Point} from 'phaser'
import {rand} from '../utils'

export default class Link extends Phaser.Graphics {
    flow = null

    constructor(game, id, quality, node1, node2) {
        let center = Point.centroid([node1.position, node2.position])
        super(game, center.x, center.y)

        this.id = id
        this.size = quality
        this.n1 = node1
        this.n2 = node2

        node1.link(node2, this)
        node2.link(node1, this)

        this.alpha = this.size

        this.lineStyle(1, 0x0088FF, 1)
        this.beginFill()
        this.moveTo(this.x - this.n1.x, this.y - this.n1.y)
        this.lineTo(this.x - this.n2.x, this.y - this.n2.y)
        this.endFill()
    }

    toString() {
        return 'Link'
    }

    second(first) {
        return this.n1 === first ? this.n2 : this.n1
    }
}
