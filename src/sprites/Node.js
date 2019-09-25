import Phaser from 'phaser'
import {getNearestNodes} from '../utils'
import Flid from './Flid'

export default class Node extends Phaser.Graphics {
    static nodes = []
    static selected = null
    static hovered = null

    size = 1
    linked = []
    links = []

    constructor(game, send, id, x, y, size) {
        super(game, x, y)
        this.send = send
        this.id = id
        this.size = size

        this.inputEnabled = true

        this.events.onInputOver.add(() => Node.hovered = this)
        this.events.onInputOut.add(() => Node.hovered = null)
        this.events.onInputDown.add(() => Node.selected = this)
        this.events.onInputUp.add(::this.onDrop)

        this.lineStyle(1, 0xffffff, 1)
        this.beginFill(0xffffff)
        this.drawCircle(0, 0, this.size*30)
        this.endFill()
    }

    toString() {
        return 'Node'
    }

    getNearest(nodes, n=1) {
        return getNearestNodes(this.x, this.y, nodes, n)
    }

    link(node, link) {
        this.linked.push(node)
        this.links.push(link)
    }

    linkedWith(node) {
        return this.linked.includes(node)
    }

    onDrop() {
        if (Node.selected === this) {
            let link = this.links.find(l => l.second(this) === Flid.me.host)
            if (link)
                this.send('Jump', {link_id: link.id})
        }
        Node.selected = null
    }
}
