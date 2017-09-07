import Phaser from 'phaser'
import {rand, getNearestNodes} from '../utils'

export default class Node extends Phaser.Sprite {
    static nodes = []
    static selected = null
    static hovered = null

    size = 1
    rotateSpeed = rand.real(-0.3, 0.3)
    linked = []
    links = []
    flow = null

    constructor(game, send, id, x, y, size) {
        super(game, x, y, 'node')
        this.send = send
        this.id = id
        this.size = size

        this.anchor.set(0.5)
        this.width = this.height = 32
        this.scale.set(this.scale.x * this.size)

        this.inputEnabled = true

        this.events.onInputOver.add(() => Node.hovered = this)
        this.events.onInputOut.add(() => Node.hovered = null)
        this.events.onInputDown.add(() => Node.selected = this)
        this.events.onInputUp.add(::this.onDrop)
    }

    toString() {
        return 'Node'
    }

    update() {
        this.angle += this.rotateSpeed
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
        if (Node.hovered && Node.hovered !== this && this.linked.includes(Node.hovered)) {
            let link = this.links.find(l => l.second(this) === Node.hovered)
            /*if (this.flow.canSend(link, 0.1))
                this.flow.send(link, 0.1)*/
            let flow_id = link.flow.id
            let dir = this === link.n1 ? 'To2' : 'To1'
            this.send('ChangeFlow', {flow_id, dir})
        }
        Node.selected = null
    }
}
