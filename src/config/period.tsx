import moment from 'moment'
import type { DateItem, PeriodViewMap } from '@/interface/period'
import { getWeek } from '@/utils'

export const TASK_HEIGHT = 12
export const ROW_PADDING = 28
export const TOP_HEIGHT = 56
export const LINE_COLOR = '#E9EBF0'

export const periodTypeOption = [
  {
    label: '日视图',
    value: 'dayView'
  },
  {
    label: '周视图',
    value: 'weekView'
  },
  {
    label: '月视图',
    value: 'monthView'
  }
]

export const periodView: PeriodViewMap = {
  dayView: {
    periodType: 'dayView',
    minStepSize: 80,
    minStepUnit: 'day',
    baseStepSize: 80,
    baseStepUnit: 'day',
    standardDate: '2023-01-01',
    periodFunc() {
      const dates: DateItem[] = []
      // 获取当前年份
      const currentYear = moment().year()
      // 使用嵌套的 for 循环来遍历三年的每一天
      let x = 0

      for (let year = currentYear - 3; year <= currentYear + 3; year++) {
        const daysInYear = moment().year(year).isLeapYear() ? 366 : 365
        for (let day = 0; day < daysInYear; day++) {
          const currentDate = moment().year(year).startOf('year').add(day, 'day')
          dates.push({
            startDate: currentDate.clone().startOf('day'),
            endDate: currentDate.clone().endOf('day'),
            date: currentDate.date(),
            month: currentDate.month(),
            weekText: getWeek(currentDate.weekday()),
            weekDay: currentDate.weekday(),
            year: currentDate.year(),
            periodType: this.periodType,
            gatherText: `${currentDate.format('YYYY')}年${currentDate.format('MM')}月`,
            itemText: `${currentDate.date()} ${getWeek(currentDate.weekday())}`,
            firstCol: currentDate.date() === 1,
            firstColX: x,
            startX: x,
            endX: x + this.baseStepSize
            // holidayDetail: judgeHoliday(currentDate),
          })
          x += this.baseStepSize
        }
      }

      return dates
    }
  },
  weekView: {
    periodType: 'weekView',
    minStepSize: 24,
    minStepUnit: 'day',
    baseStepSize: 24 * 7,
    baseStepUnit: 'week',
    standardDate: '2023-01-01',
    periodFunc() {
      const weeks: DateItem[] = []
      // 获取当前年份
      const currentYear = moment().year()
      let x = 0

      for (let year = currentYear - 3; year <= currentYear + 3; year++) {
        const weeksInYear = moment().year(year).isoWeeksInYear()
        let preMonth = '01'
        for (let week = 1; week <= weeksInYear; week++) {
          const currentWeekStart = moment().year(year).isoWeek(week).startOf('isoWeek')
          const currentWeekEnd = currentWeekStart.clone().endOf('isoWeek')
          const isFirstCol = preMonth !== currentWeekEnd.format('MM')

          weeks.push({
            startDate: currentWeekStart,
            endDate: currentWeekEnd,
            month: currentWeekEnd.month(),
            week: currentWeekStart.isoWeek(),
            year: currentWeekEnd.year(),
            periodType: this.periodType,
            gatherText: currentWeekEnd.format('YYYY年MM月'),
            itemText: `第${currentWeekEnd.isoWeek()}周 ${currentWeekStart.format('M/DD')}~${currentWeekEnd.format('M/DD')}`,
            firstCol: isFirstCol,
            firstColX: isFirstCol
              ? currentWeekEnd.clone().startOf('month').diff(currentWeekStart, 'day') * this.minStepSize + x
              : 0,
            startX: x,
            endX: x + this.baseStepSize
          })
          x += this.baseStepSize
          preMonth = currentWeekEnd.format('MM')
        }
      }

      return weeks
    }
  },
  monthView: {
    periodType: 'monthView',
    minStepSize: 5,
    minStepUnit: 'day',
    baseStepSize: 155,
    baseStepUnit: 'month',
    standardDate: '2023-01-01',
    periodFunc() {
      const months: DateItem[] = []
      // 获取当前年份
      const currentYear = moment().year()
      // 使用嵌套 for 循环来遍历三年的每个月
      let preYear
      let x = 0
      for (let year = currentYear - 3; year <= currentYear + 3; year++) {
        for (let month = 0; month < 12; month++) {
          const daysInMonth = moment(`${year}-${month + 1}`, 'YYYY-MM').daysInMonth()
          const currentMonth = moment().year(year).month(month)
          months.push({
            startDate: currentMonth.clone().startOf('month'),
            endDate: currentMonth.clone().endOf('month'),
            year,
            month: currentMonth.month(),
            daysInMonth,
            gatherText: `${year}年`,
            itemText: `${currentMonth.month() + 1}月`,
            firstCol: preYear !== year,
            firstColX: x,
            periodType: this.periodType,
            startX: x,
            endX: x + daysInMonth * this.minStepSize
          })
          preYear = year
          x += daysInMonth * this.minStepSize
        }
      }
      return months
    }
  }
}
