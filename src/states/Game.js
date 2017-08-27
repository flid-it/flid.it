import Phaser from 'phaser'

import CameraHelper from '../objects/CameraHelper'

import Node from '../sprites/Node'
import Link from '../sprites/Link'
import Flow from '../sprites/Flow'

export default class extends Phaser.State {
    nodes = []
    links = []
    flows = []

    init() {
    }

    preload() {
    }

    create() {
        this.game.stage.backgroundColor = '#222'
        this.game.add.existing(new CameraHelper(this.game))

        this.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        this.ws = new WebSocket(WEBSOCKET_URL)
        this.ws.onmessage = mes => {
            mes = JSON.parse(mes.data)
            console.log(mes)

            switch (mes.type) {
                case 'GameState':
                    this.links.concat(this.nodes).concat(this.flows).forEach(a => a.destroy())

                    this.nodes = mes.nodes.map(n => new Node(this.game, n.id, n.pos.x, n.pos.y, n.size))
                    this.links = mes.links.map(l =>
                        new Link(this.game, l.id, l.quality, this.getNode(l.n1), this.getNode(l.n2)))
                    this.flows = mes.flows.map(f =>
                        new Flow(
                            this.game,
                            f.id,
                            f.amount,
                            f.host.Node !== undefined
                                ? this.getNode(f.host.Node)
                                : this.getLink(f.host.Link)
                        )
                    )

                    this.links.concat(this.nodes).concat(this.flows).forEach(::this.game.add.existing)

                    this.canRegen = true
                    break
            }
        }
    }

    getNode = id => this.nodes.find(n => n.id === id)
    getLink = id => this.links.find(l => l.id === id)
    getFlow = id => this.flows.find(f => f.id === id)

    update() {
        if (this.canRegen && this.space.isDown) {
            this.canRegen = false
            this.ws.send(JSON.stringify({type: 'Restart'}))
        }
    }

    render() {
    }
}
