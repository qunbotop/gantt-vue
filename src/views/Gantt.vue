<script setup lang="ts">
import { periodView, TOP_HEIGHT } from '@/config/period'
import type { DateItem } from '@/interface/period'
import moment from 'moment'
import { onMounted, ref, type Ref } from 'vue'

const buffer = 5
const wrapStyle = ref({ width: 900, height: 600 })
const ganttWidth = wrapStyle.value.width

// heaer_svg的dom
let headerSvgRef = ref<SVGSVGElement | null>(null)
// 当前的师徒模式
const currentView = ref(periodView.dayView)
// 全部日期数据
const dateData = ref<DateItem[]>(currentView.value.periodFunc())
// 可是区域的数据
const visibleDate = ref<DateItem[]>([])

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
  const visibleCount = Math.ceil(ganttWidth / currentView.value.baseStepSize)

  switch (currentView.value.periodType) {
    case periodView.dayView.periodType:
      todayIndex = dateData.value.findIndex((item) => item.startDate?.isSame(targetDate, 'day'))
      targetX =
        dateData.value[todayIndex]!.startX +
        (targetDate.isSame(moment(), 'day') ? currentView.value.baseStepSize / 2 : 0)
      break
    case periodView.weekView.periodType:
      todayIndex = dateData.value.findIndex((item) => item.week === week && item.year === year)
      targetX = dateData.value[todayIndex]!.startX + (currentView.value.minStepSize * targetDate.weekday() - 1)
      break
    case periodView.monthView.periodType:
      todayIndex = dateData.value.findIndex((item) => item.month === month && item.year === year)
      targetX = dateData.value[todayIndex]!.startX + (currentView.value.minStepSize * day - 1)
      break
    default:
      break
  }

  const startIndex = Math.max(Math.floor(todayIndex - visibleCount / 2 - buffer), 0)
  const endIndex = Math.min(startIndex + visibleCount + buffer * 2, dateData.value.length)

  const newCurrentX = targetX - ganttWidth / 2
  changeSvgViewBox(newCurrentX)
  visibleDate.value = dateData.value.slice(startIndex, endIndex)
  console.log('visibleDate :>> ', visibleDate)
}

const changeSvgViewBox = (newCurrentX: number) => {
  if (headerSvgRef.value) {
    const baseVal = headerSvgRef.value.viewBox.baseVal
    console.log('viewBox :>> ', headerSvgRef)
    headerSvgRef.value.setAttribute('view-box', `${newCurrentX} ${baseVal.y} ${baseVal.width} ${baseVal.height}`)
  }
}

onMounted(() => {
  initVisibleDate()
})
</script>

<template>
  <div>
    <svg
      ref="headerSvgRef"
      :width="ganttWidth * 0.6"
      :height="TOP_HEIGHT"
      fill="blue"
      stroke="red"
      :view-box="`0 0 ${ganttWidth * 0.6} ${TOP_HEIGHT}`"
      stroke-width="2"
      :style="{ cursor: 'ew-resize', userSelect: 'none' }"
    >
      <g v-for="(t, i) in visibleDate" :key="t.endX">
        <!-- <g :key="t.startX"> -->
        <line :x1="t.startX" y1="50%" :x2="t.startX" y2="100%" stroke-width="1" stroke="red"></line>
        <line :x1="t.startX" y1="100%" :x2="t.endX" y2="100%" stroke-width="1" stroke="red"></line>
        <line :x1="t.startX" y1="50%" :x2="t.endX" y2="50%" stroke-width="1" stroke="red"></line>
        <!-- </g> -->
        <!-- <rect
          :x="t.firstColX"
          y="0"
          :width="currentView.periodType === periodView.monthView.periodType ? 49 : 81"
          height="50%"
          stroke="#fff"
          fill="#fff"
        ></rect> -->
      </g>
    </svg>
  </div>
</template>

<style lang="scss" scoped></style>
