import type { Moment } from 'moment'

export type VIEW_TYPE = 'dayView' | 'weekView' | 'monthView'

export type PeriodViewMap = {
  [key in VIEW_TYPE]: PeriodView
}

export interface DateItem {
  startDate?: Moment // 起始
  endDate?: Moment // 结束
  date?: number // 日期几号
  week?: number // 第几周
  weekDay?: number // 星期几 0 1 2 3 4 5 6
  weekText?: string // 星期几名称 周一 周二 周三 周四 周五 周六 周日
  month?: number // 几月
  year?: number // 年份
  periodType: VIEW_TYPE // 视图类型
  gatherText: string // 大标题聚合文本 第一行
  itemText: string // 小标题文本 第二行
  firstCol: boolean // 是否是第一列, 用于判断聚合文本
  firstColX: number
  daysInMonth?: number // 一个月多少天
  startX: number // 起始X坐标
  endX: number // 结束X坐标
  holidayDetail?: {
    weekDay: number
    isHoliday: boolean
    isPatchWorkDay: boolean
    isWorkDay: boolean
  } // 节假日详情
}

export interface PeriodView {
  periodType: VIEW_TYPE // 视图类型
  minStepSize: number // 最小步长
  minStepUnit: string // 最小步长单位
  baseStepSize: number // 基础步长
  baseStepUnit: string // 基础步长单位
  standardDate: string // 标准日期
  periodFunc: () => DateItem[]
}
