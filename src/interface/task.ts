import { cloneDeep, isEmpty } from 'lodash'
import moment from 'moment'

export class TaskModel {
  id: number = 0
  startDate: moment.Moment = moment()
  endDate: moment.Moment = moment()
  width: number = 0
  height: number = 0
  x: number = 0
  y: number = 0
  rangeTime?: [moment.Moment, moment.Moment] = [moment(), moment()]

  constructor(data: Partial<any> = {}) {
    if (!isEmpty(data)) {
      serializeFields(this, data)
    }
  }

  setValue(value: Partial<TaskModel>) {
    return setModelValue<TaskModel>(this, value)
  }
}

export type TaskMouseDownLocationType = 'LEFT_BAR' | 'RIGHT_BAR' | 'TASKITEM' | 'OUTER'

export interface TaskDraggedInfoProps {
  /**
   * @description: 起始位置是否是从任务条上开始的，防止鼠标从SVG上拖动最终落在人物条时唤起弹窗。
   */
  initalLocation: TaskMouseDownLocationType
  /**
   * @description: 任务条是否拖动过，位移为0也算拖动过
   */
  isTaskItemDragged: boolean
  /**
   * @description: 拖动前鼠标在屏幕的起始位置
   */
  dragStartClientX: number
}

export const setModelValue = <T>(instance: T, value: Partial<T> | undefined) => {
  const copyInstance = cloneDeep(instance)

  if (value) {
    for (const key in value) {
      if (!Object.prototype.hasOwnProperty.call(copyInstance, key)) {
        continue
      }
      copyInstance[key] = value[key]
    }
  }
  return copyInstance
}

export const serializeFields = (ins: any, fields: any) => {
  for (const iterator in fields) {
    try {
      ins[iterator] = fields[iterator]
    } catch {}
  }
}
