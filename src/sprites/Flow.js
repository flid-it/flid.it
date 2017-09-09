//import {rand} from '../utils'

import Phaser from 'phaser'
import Node from './Node'
import Link from './Link'

export default class Flow extends Phaser.Text {
    host = null
    amount = 0
    inflow = 0
    sends = []

    constructor(game, id, amount, host) {
        super(game, host.x, host.y, amount.toFixed(1), {font: '12pt Arial', fill: 'red'})
        this.id = id
        this.amount = amount
        this.host = host
        this.host.flow = this

        this.anchor.set(0.5)
    }

    toString() {
        return `Flow on ${this.host}`
    }
/*
    preUpdate() {
        this.amount += this.inflow
        this.inflow = 0
        if (this.host instanceof Node)
            this.amount += this.host.size * this.game.time.elapsed / 1000
    }
*/
    update(){
        this.text = this.amount.toFixed(1)
        /*if (this.host instanceof Node) {
            this.text = this.amount.toFixed(1)
        }
        if (this.host instanceof Link) {
            this.text = (this.amount / (this.game.time.elapsed / 1000)).toFixed(1)
        }*/
    }
/*
    postUpdate() {
        let r = rand.shuffle([...this.sends])
        for (let send of r) {
            let d = Math.min(send.amount * this.game.time.elapsed / 1000, this.amount)
            this.amount -= d
            if (this.host instanceof Link)
                d *= this.host.size
            send.obj.flow.inflow += d
            if (!this.amount)
                break
        }
    }
*/
    canSend(toObj, amount) {
        return toObj.flow.canReceive(this.host, amount)
    }

    send(toObj, amount) {
        if (!this.canSend(toObj, amount))
            throw new Error(`Cannot send ${amount} flow to ${toObj}`)

        let s = this.sends.find(s => s.obj === toObj)
        if (s)
            s.amount += amount
        else
            this.sends.push({obj: toObj, amount})
        toObj.flow.receive(this.host, amount)
    }

    // noinspection JSUnusedLocalSymbols
    canReceive(fromObj, amount) {
        if (this.host instanceof Node)
            return true
        if (this.host instanceof Link)
            return this.sends.length === 0 || this.sends[0].obj === this.host.second(fromObj)
    }

    receive(fromObj, amount) {
        if (this.host instanceof Link)
            this.send(this.host.second(fromObj), amount)
    }
}
