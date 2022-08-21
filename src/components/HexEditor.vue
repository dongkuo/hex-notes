<script setup>
import { reactive } from 'vue';
import selectHandler from '../utils/selectHandler'
import hoverHandler from '../utils/hoverHandler'

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
  mode: 'n', // n: normal mode, s: select mode, e: edit mode
})

const editorWrapperStyle = reactive({
  gridTemplateColumns: buildGridTemplateColumnsStyle()
})

initBuffer()

selectHandler.register(
  resolveIndex,
  (index) => data.buffer[index].selected = !data.buffer[index].selected,
  (index) => data.buffer[index].selected = !data.buffer[index].selected,
  () => {
    data.mode = 's'
    cancelHover()
  },
  () => data.mode = 'n'
)

hoverHandler.register(
  ele => {
    if (data.mode === 's') {
      return
    }
    const index = resolveIndex(ele)
    data.buffer[index].hover = true
    data.hoverIndex = index
  },
  ele => {
    const index = resolveIndex(ele)
    data.buffer[index].hover = false
    data.hoverIndex = null
  }
)

function resolveIndex(ele) {
  return parseInt(ele.getAttribute('index'))
}

function initBuffer() {
  const bufferSize = props.rowNum * props.columnNum
  for (let i = 0; i < bufferSize; i++) {
    const value = props.modelValue[i] === undefined ? 0 : props.modelValue[i]
    data.buffer[i] = { value }
  }
}

function cancelHover() {
  if (data.hoverIndex !== null) {
    data.buffer[data.hoverIndex].hover = false
    data.hoverIndex = null
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
      :class="{ selected: byte.selected, hover: byte.hover }" @mousedown="selectHandler.onMouseDown"
      @mouseup="selectHandler.onMouseUp" @mousemove="selectHandler.onMouseMove" @mouseover="hoverHandler.onMouseOver"
      @mouseout="hoverHandler.onMouseOut">
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
  background: #f5c953;
}

.byte.hover {
  background: #cccccc;
}
</style>
