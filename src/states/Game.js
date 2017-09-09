import Phaser from 'phaser'

import CameraHelper from '../objects/CameraHelper'

import Node from '../sprites/Node'
import Link from '../sprites/Link'
import Flow from '../sprites/Flow'

export default class extends Phaser.State {
    nodes = {}
    links = {}
    flows = {}

    init() {
    }

    preload() {
    }

    send(type, obj={}) {
        this.ws.send(JSON.stringify({type, ...obj}))
    }

    onMessage(mes) {
        mes = JSON.parse(mes.data)
        //console.log(mes)

        switch (mes.type) {
            case 'GameState':
                Object.values(this.links).concat(Object.values(this.nodes)).forEach(a => a.destroy())
                this.nodes = {}
                this.links = {}

                for (let n of mes.nodes)
                    this.nodes[n.id] = new Node(this.game, ::this.send, n.id, n.pos.x, n.pos.y, n.size)
                for (let l of mes.links)
                    this.links[l.id] = new Link(this.game, l.id, l.quality, this.nodes[l.n1], this.nodes[l.n2])

                Object.values(this.links).concat(Object.values(this.nodes)).forEach(::this.game.add.existing)

                this.makeFlows(mes.flows)

                this.canRegen = true
                setInterval(() => this.send('Calc'), 300)
                break
            case 'FlowState':
                this.makeFlows(mes.flows)
                break
            //TODO FlowUpdate
        }
    }

    create() {
        this.game.stage.backgroundColor = '#222'
        this.game.add.existing(new CameraHelper(this.game))

        this.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)

        this.ws = new WebSocket(WEBSOCKET_URL)
        this.ws.onmessage = ::this.onMessage
    }

    makeFlows(flows) {
        let newFlows = {}
        for (let f of flows) {
            let t
            if (t = this.flows[f.id]) {
                delete this.flows[f.id]
                t.amount = f.amount
            }
            else {
                t = new Flow(
                    this.game,
                    f.id,
                    f.amount,
                    f.host.Node !== undefined
                        ? this.nodes[f.host.Node]
                        : this.links[f.host.Link.id]
                )
                this.game.add.existing(t)
            }
            newFlows[f.id] = t
        }

        Object.values(this.flows).forEach(f => f.destroy())
        this.flows = newFlows
    }

    update() {
        if (this.canRegen && this.space.isDown) {
            this.canRegen = false
            this.send('Restart')
        }
    }

    render() {
    }
}
