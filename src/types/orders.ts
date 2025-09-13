export interface IOrder {
  id: string
  customerName: string
  customerEmail: string
  pickupAddress: string
  deliveryAddress: string
  items: IOrderItem[]
  totalWeight: number
  status: 'pending' | 'assigned' | 'in_transit' | 'delivered' | 'cancelled'
  createdAt: string
  scheduledAt?: string
  truckId?: string
}

export interface IOrderItem {
  id: string
  name: string
  quantity: number
  weight: number
  description?: string
}

export interface ICreateOrderData {
  customerName: string
  customerEmail: string
  pickupAddress: string
  deliveryAddress: string
  items: Omit<IOrderItem, 'id'>[]
  scheduledAt?: string
}
