export interface IMonthlySummary {
  totalOrders: number
  totalTrips: number
  totalFuelLiters: number
  totalHours: number
  growth: {
    ordersGrowth: number
    tripsGrowth: number
    fuelGrowth: number
    hoursGrowth: number
  }
}

export interface IYearlySummary {
  ordersPerMonth: Array<{ month: string; orders: number }>
  tripsPerMonth: Array<{ month: string; trips: number }>
  locationsPieChart: Array<{ location: string; trips: number }>
  expensesPerMonth: Array<{
    month: string
    fuelCost: number
    laborCost: number
    totalExpenses: number
  }>
  topDriversChart: Array<{
    driverName: string
    trips: number
    workingHours: number
  }>
}

export interface ISummaryCard {
  key: string
  title: string
  value: string
  growth: number
  icon: string
  iconBg: string
}
