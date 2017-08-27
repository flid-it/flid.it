import Phaser from 'phaser'
import {rand, getNearestNodes} from '../utils'

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
                        new Link(this.game, l.id, this.getNode(l.n1), this.getNode(l.n2)))
                    this.flows = this.nodes.concat(this.links).map(a => new Flow(this.game, a))

                    this.links.concat(this.nodes).concat(this.flows).forEach(::this.game.add.existing)

                    this.canRegen = true
                    break
            }
        }
    }

    getNode = id => this.nodes.find(n => n.id === id)

    update() {
        if (this.canRegen && this.space.isDown) {
            this.canRegen = false
            this.ws.send(JSON.stringify({type: 'Restart'}))
        }
    }

    render() {
    }
}
