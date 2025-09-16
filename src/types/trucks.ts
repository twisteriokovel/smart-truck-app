export interface ITruck {
  _id: string
  plateNumber: string
  vinCode: string
  registrationCertificate: string
  driverName: string
  width: number | string
  height: number | string
  length: number | string
  maxWeight: number | string
  truckModel?: string
  manufacturingYear?: string
  notes?: string
  isActive: boolean
  maxPallets: number
  createdAt: Date
  updatedAt: Date
}

export interface ICreateTruckData {
  plateNumber: string
  vinCode: string
  registrationCertificate: string
  driverName: string
  width: string
  height: string
  length: string
  maxWeight: string
  truckModel?: string
  manufacturingYear?: string
  notes?: string
  isActive?: boolean
}
