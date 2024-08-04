<template>
  <g class="task-item-group">
    <defs>
      <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="4" dy="4" stdDeviation="4" flood-color="rgba(0, 0, 0, 0.1)" />
      </filter>
      <g id="handle">
        <rect width="2.5" :height="task.height" rx="2" ry="2" fill="#d9dad9"></rect>
      </g>
    </defs>
    <g class="task-item-bar">
      <rect
        :x="task.x - 15"
        :y="task.y - task.height / 2"
        :width="task.width + 30"
        :height="task.height * 2"
        rx="8"
        ry="8"
        fill="#fff"
        stroke="#f1f1f1"
        filter="url(#shadow)"
      ></rect>
      <use href="#handle" :x="task.x - 11" :y="task.y"></use>
      <use href="#handle" :x="task.x - 6" :y="task.y"></use>
      <rect
        :x="task.x - 15"
        :y="task.y - task.height / 2"
        :width="15"
        :height="task.height * 2"
        :style="{ cursor: 'w-resize', opacity: 0 }"
        @mousedown="(e) => barHandleMouseDown(e, task, 'LEFT_BAR')"
      ></rect>
      <use href="#handle" :x="task.x + task.width + 3" :y="task.y"></use>
      <use href="#handle" :x="task.x + task.width + 8" :y="task.y"></use>
      <rect
        :x="task.x + task.width"
        :y="task.y - task.height / 2"
        :width="15"
        :height="task.height * 2"
        :style="{ cursor: 'w-resize', opacity: 0 }"
        @mousedown="(e) => barHandleMouseDown(e, task, 'RIGHT_BAR')"
      ></rect>
    </g>
    <rect
      @mousedown="(e) => taskItemHandleMouseDown(e, task)"
      @mouseup="() => taskItemHandleMouseUp(task)"
      :x="task.x"
      :y="task.y"
      :width="task.width"
      :height="task.height"
      rx="3"
      ry="3"
      class="task-item"
    ></rect>
  </g>
</template>

<script setup lang="ts">
import type { TaskModel, TaskDraggedInfoProps, TaskMouseDownLocationType } from '@/interface/task'
import { ref } from 'vue'

interface TaskItem {
  task: TaskModel
  isTaskItemDraggedInfo: TaskDraggedInfoProps
  onDragHandleBarDown: (location: TaskMouseDownLocationType, taskItem: TaskModel, event: MouseEvent) => void
  onDragHandleTaskItemDown: (location: TaskMouseDownLocationType, taskItem: TaskModel, event: MouseEvent) => void
}

const { task, isTaskItemDraggedInfo, onDragHandleBarDown, onDragHandleTaskItemDown } = defineProps<TaskItem>()

console.log('task :>> ', task)

// 任务条两侧拖拽bar的mousedown事件
const barHandleMouseDown = (event: MouseEvent, taskDetail: TaskModel, location: TaskMouseDownLocationType) => {
  onDragHandleBarDown(location, taskDetail, event)
}

const taskItemHandleMouseDown = (event: MouseEvent, taskDetail: TaskModel) => {
  onDragHandleTaskItemDown('TASKITEM', taskDetail, event)
}

const taskItemHandleMouseUp = (taskDetail: TaskModel) => {}
</script>

<style lang="scss" scoped>
@import url('./index.scss');
</style>
