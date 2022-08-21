import { exec } from './funcUtil'
const hoverHandler = {}

let hoverFunc = null
let unhoverFunc = null

hoverHandler.onMouseOver = function (event) {
  exec(hoverFunc, event.target)
}

hoverHandler.onMouseOut = function (event) {
  exec(unhoverFunc, event.target)
}

hoverHandler.register = function (onHover, onUnhover) {
  hoverFunc = onHover
  unhoverFunc = onUnhover
}

export default hoverHandler
