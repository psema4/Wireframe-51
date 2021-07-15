/* Exerion.js - a js port of the Exerion landscape tutorial from Wireframe 51
 *
 * https://github.com/Wireframe-Magazine/Wireframe-51/tree/main/exerion-source-code
 *
 * ! EXPERIMENTAL !
 *
 * This implementation does "just enough" to make the Exerion Zero tutorial work with
 * vanilla javascript.  It relies on a custom polyfill for pygame zero, which you should
 * find in the lib folder.
 *
 * Generally speaking, there are a handful of things left to do to convert this into
 * a reasonably playable game:
 *
 * 1. handle keyboard (and/or mouse and/or gamepad) inputs
 * 2. ai actors and waves of them
 * 3. collision handling and score keeping
 * 4. music and sound effects
 * 5. engine states, transitions and levels
 *
 * Consider improving the pygamezero polyfill, at least enough to support actor positioning
 *
 * Also consider wrapping this script in a class, so that it can be instantiated to create
 * levels with different attributes (such as color palette and/or sprites)
 *
*/

const WIDTH = 600
const HEIGHT = 800
const screen = new Screen(document.querySelector('#screen'), { width: WIDTH, height: HEIGHT })

const ship = new Actor('ship', { center: { x: 300, y: 700 } })

let count = 0
let startcol = 0
const stripes = []

for (let s=0; s<20; s++) {
    stripes.push( (s+1)*4 )
}

const landscape = []
const landitems = [1,2,3,3,2,1,2,3,2,3,1]
const landindexes = [-5,-8,-10,-13,-14,-20,-22,-26,-28,-30,-31]

for (let l=0; l<10; l++) {
    let actor = new Actor('landscape'+landitems[l], { center: { x: 800, y: 1000 } })
    actor.index = landindexes[l]
    actor.yoff = 0
    landscape.push(actor)
}

function draw() {
    screen.clear()

    drawLand()

    screen.drawText("EXERION ZERO (JS)", {
        center: {
            x: 300,
            y: 400
        },
        owidth: 0.5,
        ocolor: { r: 255, g: 255, b: 0 },
        color: { r:255, g: 0, b: 0 },
        fontsize: 30
    })

    screen.drawText("1UP", {
        center: {
            x: 100,
            y: 30
        },
        owidth: 0.5,
        ocolor: { r: 255, g: 255, b: 255 },
        color: { r:255, g: 255, b: 255 },
        fontsize: 18
    })

    screen.drawText("00", {
        center: {
            x: 100,
            y: 50
        },
        owidth: 0.5,
        ocolor: { r: 255, g: 0, b: 0 },
        color: { r:255, g: 0, b: 0 },
        fontsize: 18
    })

    screen.drawText("HIGH SCORE", {
        center: {
            x: 300,
            y: 30
        },
        owidth: 0.5,
        ocolor: { r: 255, g: 255, b: 255 },
        color: { r:255, g: 255, b: 255 },
        fontsize: 18
    })

    screen.drawText("00", {
        center: {
            x: 300,
            y: 50
        },
        owidth: 0.5,
        ocolor: { r: 255, g: 0, b: 0 },
        color: { r:255, g: 0, b: 0 },
        fontsize: 18
    })

    screen.drawText("2UP", {
        center: {
            x: 500,
            y: 30
        },
        owidth: 0.5,
        ocolor: { r: 255, g: 255, b: 255 },
        color: { r:255, g: 255, b: 255 },
        fontsize: 18
    })

    screen.drawText("00", {
        center: {
            x: 500,
            y: 50
        },
        owidth: 0.5,
        ocolor: { r: 255, g: 0, b: 0 },
        color: { r:255, g: 0, b: 0 },
        fontsize: 18
    })

    ship.draw()
}

function update() {
    count += 1
/*
 * disable keyboard handling for now
 *
    if (keyboard.left and ship.x > 100) {
        if (ship.angle < 30) {
            ship.angle += 2
        }

        ship.x -= ship.angle/6

    } else if (keyboard.right and ship.x < 500) {
        if (ship.angle > -30) {
            ship.angle -= 2
        }

        ship.x -= ship.angle/6

    } else if (keyboard.up and ship.y > 400) {
        ship.y -= 4

    } else if (keyboard.down and ship.y < 750) {
        ship.y += 4
    }

    if (!keyboard.left && !keyboard.right) {
        if ship.angle > 0: ship.angle -= 2
        if ship.angle < 0: ship.angle += 2
    }
*/
    for (let s=0; s<20; s++) {
        stripes[s] += 0.2
    }

    if (stripes[0] > 10) {
        let stripe = stripes.pop()
        stripes.unshift(stripe)
        stripes[0] = 1

        if (startcol == 0) {
            startcol = 40
        } else {
            startcol = 0
        }

        updateLandscape()
    }
        
}

function drawLand() {
    let sh = (800 - ship.y) / 2

    screen.blit('background', 0, sh/2)

    y = 300 + sh
    col = startcol

    for (let l=0; l<10; l++) {
        if (landscape[l].index < 0) {
            landscape[l].x = parallax(y)
            landscape[l].y = y - landscape[l].yoff - (landscape[l].index * 23) - 30
            landscape[l].yoff += 0.5
            landscape[l].draw()
        }
    }

    for (let s=0; s<20; s++) {
        col = col + 40
        
        if (col > 40) {
            col = 0
        }

        let rect = new Rect(0, y, 600, stripes[s])
        screen.drawFilledRect(rect, { r: 200, g: col, b: 0 })
        
        for (let l=0; l<10; l++) {
            if (landscape[l].index == s) {
                landscape[l].y = y - stripes[s] - 30

                // we don't support pygame zero positioning yet; center on the x axis
                landscape[l].x = parallax(y) - landscape[l].elem.width/2

                landscape[l].draw()
            }
        }
        y += stripes[s]-1
    }
        
}

function updateLandscape() {
    for (let l=0; l<10; l++) {
        landscape[l].index += 1
        landscape[l].yoff = 0

        if (landscape[l].index > 20) {
            landscape[l].index = -10
        }
    }

}

function parallax(y) {
    let sh = (800-ship.y)/2
    return ((300-ship.x) * ((y-sh)/500))+300
}



// clear the screen and start the demo (bounces the ship around the screen)
screen.clear()

let shipDirection = {
    x: 1,
    y: -1
}

function gameLoop() {
    ship.x += shipDirection.x
    ship.y += shipDirection.y

    if (ship.x < 100 || ship.x > 500) {
        shipDirection.x *= -1
    }

    if (ship.y < 400 || ship.y > 700) {
        shipDirection.y *= -1
    }
    update()
    draw()

    requestAnimationFrame(gameLoop)
}

gameLoop()
