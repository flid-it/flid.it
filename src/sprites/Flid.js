//import {rand} from '../utils'

import Phaser from 'phaser'

import GameState from '../states/Game'

export default class Flid extends Phaser.Graphics {
    static me = null
    host = null

    constructor(game, id, host, jump, my=false) {
        super(game, host.x, host.y)
        this.id = id
        this.host = host
        this.jump = jump
        this.my = my
        if (my)
            Flid.me = this
    }

    calc() {
        if (!this.jump) {
            this.x = this.host.x
            this.y = this.host.y
        } else {
            let points = [this.host.n1, this.host.n2]
            if (this.jump.dir === 'To1')
                points.reverse()
            let passed = GameState.time - this.jump.start_at
            let total = this.jump.arrive_at - this.jump.start_at
            let p = Phaser.Point.interpolate(points[0], points[1], Math.min(passed / total, 1))
            this.x = p.x
            this.y = p.y
        }
    }

    toString() {
        return `Flid on ${this.host}`
    }

    update() {
        this.calc()
        this.clear()
        this.beginFill(this.my ? 0x00ff00 : 0xff0000, 0.4)
        this.drawCircle(0, 0, 50)
        this.endFill()
    }
}
