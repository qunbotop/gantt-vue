import { ROW_PADDING, TASK_HEIGHT } from '@/config/period'
import type { DateItem, PeriodView } from '@/interface/period'
import type { TaskModel } from '@/interface/task'
import { cloneDeep } from 'lodash'

export const getWeek = (week: number) => {
  const weekMap = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  return weekMap[week]
}

// 根据日周月视图 重新计算任务项List各项进度条的起始坐标
export const calculatedTaskList = ({
  taskList,
  dateList,
  view
}: {
  taskList: TaskModel[]
  dateList: DateItem[]
  view: PeriodView
}) => {
  const standardDate = dateList[0].startDate
  // 最小步长
  const { minStepSize } = view

  const _list = cloneDeep(taskList).map((item, index) => {
    if (!item.id) {
      return item.setValue({
        height: TASK_HEIGHT,
        y: TASK_HEIGHT * index + ROW_PADDING * index * 2 + ROW_PADDING
      })
    }
    const gapDays = item.endDate.diff(item.startDate, 'days') + 1
    // 任务条的宽度
    const width = gapDays * minStepSize
    // 任务条高度
    const height = TASK_HEIGHT
    // 计算任务项起始位置的x坐标，任务开始时间距离标准起始日期的距离
    const x = item.startDate.diff(standardDate, 'days') * minStepSize
    // 任务项起始位置的y坐标
    const y = TASK_HEIGHT * index + ROW_PADDING * index * 2 + ROW_PADDING

    return item.setValue({
      width,
      height,
      x,
      y
    })
  })

  return _list
}
