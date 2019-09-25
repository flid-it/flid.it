import Phaser, {Point} from 'phaser'

export default class Link extends Phaser.Graphics {
    constructor(game, id, quality, node1, node2) {
        let center = Point.centroid([node1.position, node2.position])
        super(game, center.x, center.y)

        this.id = id
        this.size = quality
        this.n1 = node1
        this.n2 = node2

        node1.link(node2, this)
        node2.link(node1, this)

        //let steps = 8
        let color = 0x00ffff //Phaser.Color.interpolateColor(0x00ff00, 0xff0000, steps, Math.round(this.size*steps))
        this.lineStyle(1, color, 0.6)
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
