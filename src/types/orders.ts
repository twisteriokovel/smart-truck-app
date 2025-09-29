import type { IAddress } from '@/types/addresses'

export enum OrderStatus {
  DRAFT = 'draft',
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
  CANCELLED = 'cancelled',
}

export interface IPallet {
  id: string
  weight: number
  height: number
}

export interface IOrderFormData {
  pallets: IPallet[]
  destinationAddressId: string
  notes?: string
}

export interface IOrderResponse {
  _id: string
  cargoWeight: number
  remainingCargo: number
  status: OrderStatus
  destinationAddressId: string
  destinationAddress?: IAddress
  pallets?: IPallet[]
  notes?: string
  trips: string[]
  createdAt: Date
  updatedAt: Date
}
