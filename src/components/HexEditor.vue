<script setup>
import { reactive } from 'vue';

const props = defineProps({
  modelValue: {
    type: Array,
    default: []
  },
  rowNum: {
    type: Number,
    default: 20
  },
  columnNum: {
    type: Number,
    default: 16
  },
  columnWidth: {
    type: [Number, String],
    default: 28
  }
})

const data = reactive({
  buffer: [],
  hoverIndex: null,
  focusIndex: null,
  selectMode: false
})

const editorWrapperStyle = reactive({
  gridTemplateColumns: buildGridTemplateColumnsStyle()
})

initBuffer()

function initBuffer() {
  const bufferSize = props.rowNum * props.columnNum
  for (let i = 0; i < bufferSize; i++) {
    const value = props.modelValue[i] === undefined ? 0 : props.modelValue[i]
    data.buffer[i] = { value }
  }
}

function buildGridTemplateColumnsStyle() {
  const width = typeof (props.columnWidth) === 'number' ?
    props.columnWidth + 'px' : props.columnWidth
  let style = ''
  for (let i = 0; i < props.columnNum; i++) {
    style += width + ' '
  }
  return style
}

let startSelectIndex = null
let endSelectIndex = null
function onClickDown(event) {
  data.selectMode = true
  startSelectIndex = parseInt(event.target.getAttribute('index'))
  endSelectIndex = startSelectIndex
  data.buffer[startSelectIndex].selected = true
}

function onClickUp(event) {
  console.log('up:', startSelectIndex, endSelectIndex);
  data.selectMode = false
}

function onClickMove(event) {
  const index = parseInt(event.target.getAttribute('index'))
  data.hoverIndex = index
  if (!data.selectMode) {
    return
  }
  const leftIndex = Math.min(startSelectIndex, index);
  const rightIndex = Math.max(startSelectIndex, index);

  if (endSelectIndex < leftIndex) {
    for (let i = endSelectIndex; i < leftIndex; i++) {
      data.buffer[i].selected = false
    }
  } else if (endSelectIndex > rightIndex) {
    for (let i = rightIndex + 1; i <= endSelectIndex; i++) {
      data.buffer[i].selected = false
    }
  }
  for (let i = leftIndex; i <= rightIndex; i++) {
    data.buffer[i].selected = true
  }
  endSelectIndex = index
}

function onMouseOutEditor() {
  data.hoverIndex = null
}

function num2hex(num) {
  const hex = num.toString(16).toUpperCase()
  return hex.length === 1 ? 0 + hex : hex
}

</script>

<template>
  <div class="line-number-wrapper">
  </div>
  <div class="editor-wrapper" :style="editorWrapperStyle" @mouseout="onMouseOutEditor">
    <span v-for="(byte, index) in data.buffer" class="byte" :key="index + ':' + byte.value" :index="index"
      :class="{ selected: byte.selected, hover: data.hoverIndex === index, selectMode: byte.selected && data.selectMode }"
      @mousedown="onClickDown" @mouseup="onClickUp" @mousemove="onClickMove">
      {{ num2hex(byte.value) }}
    </span>
  </div>
</template>

<style scoped>
.editor-wrapper {
  font-family: 'Roboto Mono', Courier, monospace;
  display: inline-grid;
  grid-template-columns: auto auto auto;
  user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -moz-user-select: none;
}

.byte {
  line-height: 28px;
  text-align: center;
}

.byte.selected {
  background: #cce0f0fd;
}

.byte.hover {
  background: #cccccc;
}

.byte.hover.selectMode {
  background: #cce0f0fd !important;
}
</style>
