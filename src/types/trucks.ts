export interface ITruck {
  id: string
  licensePlate: string
  make: string
  model: string
  year: number
  capacity: number
  status: 'active' | 'maintenance' | 'inactive'
  driverId?: string
}

export interface ICreateTruckData {
  licensePlate: string
  make: string
  model: string
  year: number
  capacity: number
  status: 'active' | 'maintenance' | 'inactive'
  driverId?: string
}
