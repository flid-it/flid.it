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
                case 'SetPlayer':
                    this.ws.send(JSON.stringify({type: 'GetState', id: mes.id}))
                    break
                case 'GameState':
                    this.links.concat(this.nodes).concat(this.flows).forEach(a => a.destroy())

                    this.nodes = mes.nodes.map(n => new Node(this.game, n.pos.x, n.pos.y, n.size))
                    this.links = this.genLinks(this.nodes)
                    this.flows = this.nodes.concat(this.links).map(a => new Flow(this.game, a))

                    this.links.forEach(::this.game.add.existing)
                    this.nodes.forEach(::this.game.add.existing)
                    this.flows.forEach(::this.game.add.existing)

                    this.canRegen = true
                    break
            }
        }
    }

    genNodes(n) {
        let nodes = []
        while (nodes.length < n) {
            let x = rand.integer(-1000, 1000)
            let y = rand.integer(-1000, 1000)

            if (getNearestNodes(x, y, nodes, 1, -100).length)
                continue

            let node = new Node(this.game, x, y)
            nodes.push(node)
        }
        return nodes
    }

    genLinks(nodes) {
        let res = []
        for (let node of nodes) {
            let linksCount = rand.integer(2, 5) + 1
            res = res.concat(node.getNearest(nodes, linksCount)
                .splice(1)
                .filter(n => !node.linkedWith(n))
                .map(n => new Link(this.game, node, n)))
        }
        return res
    }

    update() {
        if (this.canRegen && this.space.isDown) {
            this.canRegen = false
            this.ws.send(JSON.stringify({type: 'Restart'}))
        }
    }

    render() {
    }
}
