<script setup lang="ts">
import { LINE_COLOR, periodView, ROW_PADDING, TASK_HEIGHT, TOP_HEIGHT } from '@/config/period'
import type { DateItem } from '@/interface/period'
import { max } from 'lodash'
import moment from 'moment'
import { computed, onMounted, ref, watch, watchEffect, type Ref } from 'vue'
import TaskItem from '@/components/TaskItem/Index.vue'
import { taskListMock } from '@/mock/taskList'
import { TaskModel, type TaskDraggedInfoProps } from '@/interface/task'
import { calculatedTaskList } from '@/utils'

const buffer = 5
const wrapStyle = ref({ width: 900, height: 600 })
const ganttWidth = wrapStyle.value.width
const GANTT_WIDTH = ganttWidth * 0.6
const mainContentHeight = computed(() => {
  return max([taskList.value.length * (TASK_HEIGHT + ROW_PADDING * 2), wrapStyle.value.height - TOP_HEIGHT - 8]) || 0
})

// heaer_svg的dom
let headerSvgRef = ref<SVGSVGElement | null>(null)
// main_svg的dom
let mainSvgRef = ref<SVGSVGElement | null>(null)
// 当前的视图模式
const currentPeriodView = ref(periodView.dayView)
// 全部日期数据
const dateData = ref<DateItem[]>(currentPeriodView.value.periodFunc())
// 可是区域的数据
const visibleDate = ref<DateItem[]>([])
// 用户是否拖拽了任务条，涉及的信息，拖拽的位置、是否拖拽、拖拽开始的clientX
const isTaskItemDraggedInfo = ref<TaskDraggedInfoProps>({
  initalLocation: 'OUTER',
  isTaskItemDragged: false,
  dragStartClientX: 0
})

const taskList = ref<Array<TaskModel>>([])

watchEffect(() => {
  const _taskList = taskListMock.map((t) => new TaskModel(t))
  taskList.value = calculatedTaskList({ taskList: _taskList, dateList: dateData.value, view: currentPeriodView.value })
})

const globalSVGMouseDownEvent = ref<MouseEvent | null>(new MouseEvent('mousedown'))

const initVisibleDate = () => {
  const targetDate = moment()
  // 找到目标日期的x坐标、可视区域的startIdx和endIdx
  let targetX = 0
  let todayIndex = 0

  const week = targetDate.week()
  const month = targetDate.month()
  const year = targetDate.year()
  const day = targetDate.date()

  // 展示多少数量
  const visibleCount = Math.ceil(ganttWidth / currentPeriodView.value.baseStepSize)

  switch (currentPeriodView.value.periodType) {
    case periodView.dayView.periodType:
      todayIndex = dateData.value.findIndex((item) => item.startDate?.isSame(targetDate, 'day'))
      targetX =
        dateData.value[todayIndex]!.startX +
        (targetDate.isSame(moment(), 'day') ? currentPeriodView.value.baseStepSize / 2 : 0)
      break
    case periodView.weekView.periodType:
      todayIndex = dateData.value.findIndex((item) => item.week === week && item.year === year)
      targetX = dateData.value[todayIndex]!.startX + (currentPeriodView.value.minStepSize * targetDate.weekday() - 1)
      break
    case periodView.monthView.periodType:
      todayIndex = dateData.value.findIndex((item) => item.month === month && item.year === year)
      targetX = dateData.value[todayIndex]!.startX + (currentPeriodView.value.minStepSize * day - 1)
      break
    default:
      break
  }

  const startIndex = Math.max(Math.floor(todayIndex - visibleCount / 2 - buffer), 0)
  const endIndex = Math.min(startIndex + visibleCount + buffer * 2, dateData.value.length)

  const newCurrentX = targetX - GANTT_WIDTH / 2
  changeSVGAttributes({ newCurrentX })
  visibleDate.value = dateData.value.slice(startIndex, endIndex)
}

const changeSVGAttributes = ({
  newCurrentX,
  ganttWidth = GANTT_WIDTH,
  ganttHeight = mainContentHeight.value
}: {
  newCurrentX: number
  ganttWidth?: number
  ganttHeight?: number
}) => {
  ;[headerSvgRef, mainSvgRef].forEach((svgRef) => {
    if (svgRef.value) {
      const { x, y, width: baseWidth, height: baseHeight } = svgRef.value.viewBox.baseVal

      const width = ganttWidth ?? baseWidth
      const height = svgRef === mainSvgRef ? (ganttHeight ?? baseHeight) : baseHeight
      const viewBoxX = newCurrentX ?? x

      svgRef.value.setAttribute('width', `${width}`)
      svgRef.value.setAttribute('height', `${height}`)
      svgRef.value.setAttribute('viewBox', `${viewBoxX} ${y} ${width} ${height}`)
    }
  })
}

const handleScroll = ({ deltaX, deltaY }: { deltaX: number; deltaY: number }) => {
  if (mainSvgRef.value) {
    const mainSVGBaseVal = mainSvgRef.value.viewBox.baseVal
    const newCurrentX = deltaX ? mainSVGBaseVal.x + deltaX : mainSVGBaseVal.x
    const newCurrentY = deltaY ? mainSVGBaseVal.y + deltaY : mainSVGBaseVal.y
    const startId = Math.max(
      Math.floor(newCurrentX / currentPeriodView.value.baseStepSize) -
        (newCurrentX < visibleDate.value[1].startX ? buffer * 2 : buffer),
      0
    )
    const endId = Math.min(
      startId + Math.ceil(ganttWidth / currentPeriodView.value.baseStepSize) + buffer * 2,
      dateData.value.length
    )
    visibleDate.value = dateData.value.slice(startId, endId)
    changeSVGAttributes({ newCurrentX })
  }
}

const endMove = () => {
  globalSVGMouseDownEvent.value = null
}

const handleMouseMove = (event: MouseEvent) => {
  if (!globalSVGMouseDownEvent.value) return
  handleScroll({
    deltaX: -(event.clientX - globalSVGMouseDownEvent.value.clientX),
    deltaY: -(event.clientY - globalSVGMouseDownEvent.value.clientY)
  })
  globalSVGMouseDownEvent.value = event
}

const handleMouseDown = (e: MouseEvent) => {
  globalSVGMouseDownEvent.value = e
}

const handleMouseLeave = () => {
  endMove()
}

onMounted(() => {
  initVisibleDate()
})
</script>

<template>
  <div
    :style="{ width: ganttWidth, height: `${mainContentHeight + TOP_HEIGHT}px` }"
    @mousemove="handleMouseMove"
    @mousedown="handleMouseDown"
    @mouseleave="handleMouseLeave"
    @mouseup="handleMouseLeave"
  >
    <div class="gantt-header">
      <svg
        ref="headerSvgRef"
        :width="GANTT_WIDTH"
        :height="TOP_HEIGHT"
        :viewBox="`0 0 ${GANTT_WIDTH} ${TOP_HEIGHT}`"
        stroke-width="1"
        :style="{ cursor: 'ew-resize', userSelect: 'none' }"
      >
        <g v-for="(t, i) in visibleDate.filter((t) => t.firstCol)" :key="t.startX">
          <rect
            :x="t.firstColX"
            y="0"
            height="50%"
            :width="currentPeriodView.periodType === periodView.monthView.periodType ? 49 : 81"
            :stroke="LINE_COLOR"
          ></rect>
          <text :x="t.firstColX + 5" y="25%" alignmentBaseline="central" :stroke="LINE_COLOR">
            {{ t.gatherText }}
          </text>
          <line :x1="t.firstColX" y1="0" :x2="t.firstColX" y2="50%" stroke-width="1" :stroke="LINE_COLOR"></line>
        </g>

        <g v-for="(t, i) in visibleDate" :key="t.startX">
          <line :x1="t.startX" y1="50%" :x2="t.startX" y2="100%" stroke-width="1" :stroke="LINE_COLOR"></line>
          <line :x1="t.startX" y1="100%" :x2="t.endX" y2="100%" stroke-width="1" :stroke="LINE_COLOR"></line>
          <line :x1="t.startX" y1="50%" :x2="t.endX" y2="50%" stroke-width="1" :stroke="LINE_COLOR"></line>
          <g>
            <foreignObject :x="t.startX" y="50%" :width="t.endX - t.startX" height="20px">
              <span class="header-second-title">{{ t.itemText }}</span>
            </foreignObject>
          </g>
        </g>
      </svg>
    </div>
    <svg ref="mainSvgRef" viewBox="0 0 0 0" stroke-width="1" height="0" width="0">
      <!-- 任务条 -->
      <g v-for="(task, index) in taskList" :key="task.id">
        <TaskItem :task="task" :isTaskItemDraggedInfo="isTaskItemDraggedInfo" />
      </g>
    </svg>
  </div>
</template>

<style lang="scss" scoped>
@import url('./index.scss');
</style>
