import Phaser from 'phaser'
import {rand, getNearestNodes} from '../utils'

import CameraHelper from '../objects/CameraHelper'

import Node from '../sprites/Node'
import Link from '../sprites/Link'

export default class extends Phaser.State {
    init() {
    }

    preload() {
    }

    create() {
        this.game.stage.backgroundColor = '#222'
        this.game.add.existing(new CameraHelper(this.game))

        this.nodes = this.genNodes()
        this.links = this.genLinks(this.nodes)

        this.links.forEach(::this.game.add.existing)
        this.nodes.forEach(::this.game.add.existing)
    }

    genNodes() {
        let nodes = []
        while (nodes.length < 100) {
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
    }

    render() {
    }
}
