export const getWeek = (week: number) => {
  const weekMap = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  return weekMap[week]
}
