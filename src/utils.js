import {Point} from 'phaser'

export const centerGameObjects = (objects) => {
    objects.forEach(function (object) {
        object.anchor.setTo(0.5)
    })
}

export const rand = require('random-js')()

//if dist<0 we don't sort anything, just take first n nodes with distance < abs(dist)
export function getNearestNodes(x, y, nodes, n=1, dist=0) {
    if (n < 0) return []
    if (n === 0) n = nodes.length

    let pos = new Point(x, y)

    let source = dist >= 0
        ? [...nodes].sort((a, b) => Point.distance(pos, a.position) - Point.distance(pos, b.position))
        : nodes
    dist = Math.abs(dist)

    let res = []
    for (let node of source) {
        if (!dist || Point.distance(pos, node.position) < dist)
            res.push(node)
        if (res.length >= n)
            break
    }
    return res
}