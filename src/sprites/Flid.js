//import {rand} from '../utils'

import Phaser from 'phaser'

export default class Flid extends Phaser.Graphics {
    static me = null
    host = null

    constructor(game, id, host, my=false) {
        super(game, host.x, host.y)
        this.id = id
        this.host = host
        this.my = my
        if (my)
            Flid.me = this
    }

    toString() {
        return `Flid on ${this.host}`
    }

    update() {
        this.x = this.host.x
        this.y = this.host.y
        this.clear()
        this.beginFill(this.my ? 0x00ff00 : 0xff0000, 0.4)
        this.drawCircle(0, 0, 50)
        this.endFill()
    }
}
