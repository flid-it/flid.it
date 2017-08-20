import {rand} from '../utils'

import Phaser from 'phaser'
import Node from './Node'
import Link from './Link'

export default class Flow extends Phaser.Text {
    obj = null
    link = null
    flow = 0
    inflow = 0
    sends = []

    constructor(game, obj=null) {
        super(game, obj.x, obj.y, '0', {font: '12pt Arial', fill: 'red'})
        this.obj = obj
        this.obj.flow = this

        this.anchor.set(0.5)
    }

    toString() {
        return `Flow on ${this.obj}`
    }

    preUpdate() {
        this.flow += this.inflow
        this.inflow = 0
        if (this.obj instanceof Node)
            this.flow += this.obj.size * this.game.time.physicsElapsed
    }

    update(){
        if (this.obj instanceof Node) {
            this.text = this.flow.toFixed(1)
        }
        if (this.obj instanceof Link) {
            this.text = (this.flow / this.game.time.physicsElapsed).toFixed(1)
        }
    }

    postUpdate() {
        let r = rand.shuffle([...this.sends])
        for (let send of r) {
            let d = Math.min(send.amount * this.game.time.physicsElapsed, this.flow)
            this.flow -= d
            if (this.obj instanceof Link)
                d *= this.obj.size
            send.obj.flow.inflow += d
            if (!this.flow)
                break
        }
    }

    canSend(toObj, amount) {
        return toObj.flow.canReceive(this.obj, amount)
    }

    send(toObj, amount) {
        if (!this.canSend(toObj, amount))
            throw new Error(`Cannot send ${amount} flow to ${toObj}`)

        let s = this.sends.find(s => s.obj === toObj)
        if (s)
            s.amount += amount
        else
            this.sends.push({obj: toObj, amount})
        toObj.flow.receive(this.obj, amount)
    }

    // noinspection JSUnusedLocalSymbols
    canReceive(fromObj, amount) {
        if (this.obj instanceof Node)
            return true
        if (this.obj instanceof Link)
            return this.sends.length === 0 || this.sends[0].obj !== fromObj
    }

    receive(fromObj, amount) {
        if (this.obj instanceof Link)
            this.send(this.obj.second(fromObj), amount)
    }
}
