export interface ITrip {
  id: string
  truckId: string
  driverId: string
  orders: string[]
  route: IRoutePoint[]
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled'
  startedAt?: string
  completedAt?: string
  estimatedDistance: number
  actualDistance?: number
  estimatedDuration: number
  actualDuration?: number
}

export interface IRoutePoint {
  id: string
  address: string
  latitude: number
  longitude: number
  type: 'pickup' | 'delivery'
  orderId: string
  estimatedArrival?: string
  actualArrival?: string
}

export interface ICreateTripData {
  truckId: string
  driverId: string
  orders: string[]
  route: Omit<IRoutePoint, 'id'>[]
}
