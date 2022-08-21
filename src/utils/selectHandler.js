import { exec } from './funcUtil'

const selectHandler = {}

let active = false
let startIndex = null
let endIndex = null
let resolveIndex = null
let growFunc = null
let shrinkFunc = null
let startFunc = null
let stopFunc = null

selectHandler.onMouseDown = function (event) {
  active = true
  startIndex = resolveIndex(event.target)
  endIndex = resolveIndex(event.target)
  exec(growFunc, startIndex)
  exec(startFunc)
}

selectHandler.onMouseMove = function (event) {
  const currentIndex = resolveIndex(event.target)
  if (!active) {
    return
  }
  const oldDirection = endIndex > startIndex
  const newDirection = currentIndex > startIndex
  if (oldDirection === newDirection) {
    let minIndex = Math.min(endIndex, currentIndex)
    let maxIndex = Math.max(endIndex, currentIndex)
    let isGrow = Math.abs(currentIndex - startIndex) > Math.abs(endIndex - startIndex)
    for (let i = minIndex; i <= maxIndex; i++) {
      if (newDirection && i !== minIndex || !newDirection && i !== maxIndex) {
        isGrow ? exec(growFunc, i) : exec(shrinkFunc, i)
      }
    }
  }
  else {
    const oldMinIndex = Math.min(startIndex, endIndex)
    const oldMaxIndex = Math.max(startIndex, endIndex)
    for (let i = oldMinIndex; i <= oldMaxIndex; i++) {
      if (i !== startIndex) {
        exec(shrinkFunc, i)
      }
    }
    const newMinIndex = Math.min(startIndex, currentIndex)
    const newMaxIndex = Math.max(startIndex, currentIndex)
    for (let i = newMinIndex; i <= newMaxIndex; i++) {
      if (i !== startIndex) {
        exec(growFunc, i)
      }
    }
  }
  endIndex = currentIndex
}

selectHandler.onMouseUp = function (event) {
  active = false
  exec(stopFunc)
}

selectHandler.register = function (resolveIndexFunc, onGrowSelection, onShrinkSelection, onStart, onStop) {
  resolveIndex = resolveIndexFunc
  growFunc = onGrowSelection
  shrinkFunc = onShrinkSelection
  startFunc = onStart
  stopFunc = onStop
}


selectHandler.getCurrentSelection = function () {
  return { startIndex, endIndex }
}

selectHandler.isActive = function () {
  return active
}


export default selectHandler