import Phaser, {Point} from 'phaser'
import Node from '../sprites/Node'
import CameraHelper from '../objects/CameraHelper'
import {rand} from '../utils'

export default class extends Phaser.State {
    init() {
    }

    preload() {
    }

    create() {
        this.game.stage.backgroundColor = '#222'
        this.game.add.existing(new CameraHelper(this.game))

        this.nodes = []

        for (; this.nodes.length < 100;) {
            let x = rand.integer(-1000, 1000)
            let y = rand.integer(-1000, 1000)

            let p = new Point(x, y)
            let fail = false
            for (let n of this.nodes) {
                if (Point.distance(n.position, p) < 100) {
                    fail = true
                    break
                }
            }
            if (fail)
                continue

            let node = new Node({game: this.game, x: x, y: y})
            this.game.add.existing(node)
            this.nodes.push(node)
        }
    }

    update() {
    }

    render() {
        //game.debug.cameraInfo(game.camera, 32, 32);
    }
}
