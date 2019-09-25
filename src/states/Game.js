import Phaser from 'phaser'

import CameraHelper from '../objects/CameraHelper'

import Node from '../sprites/Node'
import Link from '../sprites/Link'
import Flow from '../sprites/Flid'

export default class GameState extends Phaser.State {
    static dt = 0

    static get time() {
        return Date.now() / 1000 + GameState.dt
    }

    static set time(time) {
        GameState.dt = time - Date.now() / 1000
    }

    myId = null

    nodes = {}
    links = {}
    flids = {}

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
            case 'Hello':
                this.myId = mes.id
                GameState.time = mes.time
                break
            case 'GameState':
                Object.values(this.links).concat(Object.values(this.nodes)).forEach(a => a.destroy())
                this.nodes = {}
                this.links = {}

                GameState.time = mes.time

                for (let n of mes.nodes)
                    this.nodes[n.id] = new Node(this.game, ::this.send, n.id, n.pos.x, n.pos.y, n.size)
                for (let l of mes.links)
                    this.links[l.id] = new Link(this.game, l.id, l.quality, this.nodes[l.n1], this.nodes[l.n2])

                Object.values(this.links).concat(Object.values(this.nodes)).forEach(::this.game.add.existing)

                this.makeFlows(mes.flids)

                this.canRegen = true
                break
            case 'FlidState':
                this.makeFlows(mes.flids)
                break
            case 'FlidUpdate':
                this.makeFlows([mes.flid])
                break
        }
    }

    create() {
        this.camera = new CameraHelper(this.game)
        this.game.stage.backgroundColor = '#222'
        this.game.add.existing(this.camera)

        this.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)

        this.ws = new WebSocket(WEBSOCKET_URL)
        this.ws.onmessage = ::this.onMessage
    }

    makeFlows(flows) {
        let newFlows = {}
        for (let f of flows) {
            let t = this.flids[f.id]
            let host = f.host.Node !== undefined
                ? this.nodes[f.host.Node]
                : this.links[f.host.Link.id]
            let jump = f.host.Link || null
            if (t) {
                delete this.flids[f.id]
                t.host = host
                t.jump = jump
            }
            else {
                t = new Flow(
                    this.game,
                    f.id,
                    host,
                    jump,
                    f.id === this.myId,
                )
                this.game.add.existing(t)
            }
            newFlows[f.id] = t
        }

        Object.values(this.flids).forEach(f => f.destroy())
        this.flids = newFlows
    }

    update() {
        if (this.canRegen && this.space.isDown && window.space) {
            this.canRegen = false
            this.send('Restart')
        }
    }

    render() {
    }
}
