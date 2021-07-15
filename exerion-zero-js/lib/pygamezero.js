/* minimalist pygame zero polyfill
 *
 * https://pygame-zero.readthedocs.io/en/stable/index.html
 *
 * ! EXPERIMENTAL !
 *
 * With few exceptions, this library only supports what is absolutely required to
 * make the Exerion Zero tutorial work with vanilla javascript
 *
 * pygame zero positioning is not supported, center is assumed for the purposes of
 * the tutorial
 *
 * https://github.com/Wireframe-Magazine/Wireframe-51/tree/main/exerion-source-code
*/

class Rect {
    constructor(x, y, w, h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }
}

class Actor extends Rect {
    constructor(name, options) {
        const imgElem = document.getElementById(name)


        const actorWidth = imgElem.width
        const actorHeight = imgElem.height

        super(
            options.center.x - actorWidth/2,
            options.center.y - actorHeight/2,
            actorWidth,
            actorHeight
        )

        this.elem = imgElem
        this.name = name
        this.filename = name + '.png'
        this.options = options
    }

    draw() {
        screen.ctx.drawImage(this.elem, this.x, this.y)
    }
}


class Screen {
    constructor(elem, options) {
        this.elem = elem
        this.options = options

        this.ctx = elem.getContext('2d')
    }

    blit(name, x, y) {
        this.ctx.drawImage(document.getElementById(name), x, y)
    }

    drawText(message, options) {
        /* options:
         * {
         *   center: { x (int), y (int) }  // fake centered handling; see https://pygame-zero.readthedocs.io/en/stable/builtins.html#actors
         *   owidth: (float)               // not implemented
         *   ocolor: (int tuple)
         *   color: (int tuple)
         *   fontsize: (int)
         * }
        */

        this.ctx.font = options.fontsize + 'px serif'
        this.ctx.fillStyle = `rgb(${options.color.r}, ${options.color.g}, ${options.color.b})`
        this.ctx.strokeStyle = `rgb(${options.ocolor.r}, ${options.ocolor.g}, ${options.ocolor.b})`

        let textWidth = parseInt(this.ctx.measureText(message).width, 10)
        let textX = options.center.x - (textWidth / 2)
        let textY = options.center.y - (options.fontsize / 2)

        this.ctx.fillText(message, textX, textY)
        this.ctx.strokeText(message, textX, textY)
    }

    drawFilledRect(rect, color) {
        this.ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`
        this.ctx.fillRect(rect.x, rect.y, rect.w, rect.h)
    }


    // -- not strictly necessary for experion.js -- //
    clear() {
        const rect = new Rect(0, 0, this.options.width, this.options.height)
        this.drawFilledRect(rect, {r: 0, g: 0, b: 0})
    }


    // -- extra debugging and tests -- //
    selfTest() {
        this.clear()
        this.drawFilledRect(new Rect(0, 0, 10, 10), { r: 31, g:127, b: 31 })
        this.drawFilledRect(new Rect(10, 10, 64, 64), { r: 31, g:31, b: 127 })
        this.drawText("s E l F - t E s T", { center: {x: 300, y: 100}, fontsize: 30, color: { r: 127, g: 31, b: 31 } })

        setTimeout(()=>{this.clear()}, 1000)
    }

}
