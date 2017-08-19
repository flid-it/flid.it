import Phaser from 'phaser'
import {rand} from '../utils'

export default class Link extends Phaser.Graphics {
    quality = rand.real(0.1, 0.9)

    constructor(game, node1, node2) {
        super(game)

        this.n1 = node1
        this.n2 = node2

        node1.addLinkTo(node2)
        node2.addLinkTo(node1)
        
        this.lineStyle(1, 0x0088FF, 1)
        this.beginFill()
        this.moveTo(this.n1.x, this.n1.y)
        this.lineTo(this.n2.x, this.n2.y)
        this.endFill()
    }

    update() {
    }
}
