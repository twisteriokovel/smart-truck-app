import type { ITruck } from './trucks'

export enum TripStatus {
  PLANNED = 'planned',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
  CANCELLED = 'cancelled',
}

export interface ITrip {
  id: string
  truckId: string
  driverId: string
  orders: string[]
  status: 'planned' | 'in_progress' | 'done' | 'cancelled'
  startedAt?: string
  completedAt?: string
  estimatedDistance: number
  actualDistance?: number
  estimatedDuration: number
  actualDuration?: number
}

export interface ICreateTripData {
  truckId: string
  driverId: string
  orders: string[]
}

export interface IOrderTrip {
  _id: string
  orderId: string
  truck: ITruck
  tripNumber: string
  startDate: Date
  status: TripStatus
  palletIds: string[]
  estimatedFuel: string
  estimatedDuration: string
  actualFuel?: string
  actualDuration?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface ICreateOrderTripData {
  orderId: string
  truckId: string
  startDate: Date
  palletIds: string[]
  estimatedFuel: string
  estimatedDuration: string
  notes?: string
}

export interface IUpdateOrderTripData {
  truckId?: string
  startDate?: Date
  palletIds?: string[]
  estimatedFuel?: string
  estimatedDuration?: string
  notes?: string
}

export interface ICompleteTripData {
  actualFuel?: string
  actualDuration?: string
  note?: string
}
