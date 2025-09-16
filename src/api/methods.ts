import { apiClient } from './client'
import type { ILoginCredentials, ILoginResponse, IUser } from '@/types/auth'
import type { IAddress, ICreateAddressData } from '@/types/addresses'
import type { ITruck, ICreateTruckData } from '@/types/trucks'
import type { IOrder, ICreateOrderData } from '@/types/orders'
import type { ITrip, ICreateTripData } from '@/types/trips'

export async function login(
  credentials: ILoginCredentials,
): Promise<ILoginResponse> {
  return apiClient.post<ILoginResponse>('/auth/login', credentials)
}

export async function getProfile(): Promise<IUser> {
  return apiClient.get<IUser>('/auth/profile')
}

export async function refreshToken(): Promise<ILoginResponse> {
  return apiClient.post<ILoginResponse>('/auth/refresh')
}

export async function logout(): Promise<void> {
  return apiClient.post<void>('/auth/logout')
}

export async function getAllAddresses(params?: {
  page?: number
  pageSize?: number
}): Promise<{
  addresses: IAddress[]
  total: number
  page: number
  pageSize: number
}> {
  const queryParams = new URLSearchParams()
  if (params?.page) queryParams.append('page', params.page.toString())
  if (params?.pageSize)
    queryParams.append('pageSize', params.pageSize.toString())

  const query = queryParams.toString()
  const url = query ? `/addresses?${query}` : '/addresses'

  return apiClient.get(url)
}

export async function getAddressById(id: string): Promise<IAddress> {
  return apiClient.get<IAddress>(`/addresses/${id}`)
}

export async function createAddress(
  data: ICreateAddressData,
): Promise<IAddress> {
  return apiClient.post<IAddress>('/addresses', data)
}

export async function updateAddress(
  id: string,
  data: Partial<ICreateAddressData>,
): Promise<IAddress> {
  return apiClient.put<IAddress>(`/addresses/${id}`, data)
}

export async function deleteAddress(id: string): Promise<void> {
  return apiClient.delete<void>(`/addresses/${id}`)
}

export async function getAllTrucks(params?: {
  page?: number
  pageSize?: number
}): Promise<{
  trucks: ITruck[]
  total: number
  page: number
  pageSize: number
}> {
  const queryParams = new URLSearchParams()
  if (params?.page) queryParams.append('page', params.page.toString())
  if (params?.pageSize)
    queryParams.append('pageSize', params.pageSize.toString())

  const query = queryParams.toString()
  const url = query ? `/trucks?${query}` : '/trucks'

  return apiClient.get(url)
}

export async function getTruckById(id: string): Promise<ITruck> {
  return apiClient.get<ITruck>(`/trucks/${id}`)
}

export async function createTruck(data: ICreateTruckData): Promise<ITruck> {
  return apiClient.post<ITruck>('/trucks', data)
}

export async function updateTruck(
  id: string,
  data: Partial<ICreateTruckData>,
): Promise<ITruck> {
  return apiClient.put<ITruck>(`/trucks/${id}`, data)
}

export async function deleteTruck(id: string): Promise<void> {
  return apiClient.delete<void>(`/trucks/${id}`)
}

export async function getAllOrders(): Promise<IOrder[]> {
  return apiClient.get<IOrder[]>('/orders')
}

export async function getOrderById(id: string): Promise<IOrder> {
  return apiClient.get<IOrder>(`/orders/${id}`)
}

export async function createOrder(data: ICreateOrderData): Promise<IOrder> {
  return apiClient.post<IOrder>('/orders', data)
}

export async function updateOrder(
  id: string,
  data: Partial<ICreateOrderData>,
): Promise<IOrder> {
  return apiClient.put<IOrder>(`/orders/${id}`, data)
}

export async function updateOrderStatus(
  id: string,
  status: IOrder['status'],
): Promise<IOrder> {
  return apiClient.patch<IOrder>(`/orders/${id}/status`, { status })
}

export async function assignTruckToOrder(
  id: string,
  truckId: string,
): Promise<IOrder> {
  return apiClient.patch<IOrder>(`/orders/${id}/assign-truck`, { truckId })
}

export async function deleteOrder(id: string): Promise<void> {
  return apiClient.delete<void>(`/orders/${id}`)
}

export async function getAllTrips(): Promise<ITrip[]> {
  return apiClient.get<ITrip[]>('/trips')
}

export async function getTripById(id: string): Promise<ITrip> {
  return apiClient.get<ITrip>(`/trips/${id}`)
}

export async function createTrip(data: ICreateTripData): Promise<ITrip> {
  return apiClient.post<ITrip>('/trips', data)
}

export async function updateTrip(
  id: string,
  data: Partial<ICreateTripData>,
): Promise<ITrip> {
  return apiClient.put<ITrip>(`/trips/${id}`, data)
}

export async function updateTripStatus(
  id: string,
  status: ITrip['status'],
): Promise<ITrip> {
  return apiClient.patch<ITrip>(`/trips/${id}/status`, { status })
}

export async function startTrip(id: string): Promise<ITrip> {
  return apiClient.patch<ITrip>(`/trips/${id}/start`)
}

export async function completeTrip(id: string): Promise<ITrip> {
  return apiClient.patch<ITrip>(`/trips/${id}/complete`)
}

export async function updateTripRouteProgress(
  id: string,
  routePointId: string,
  actualArrival: string,
): Promise<ITrip> {
  return apiClient.patch<ITrip>(`/trips/${id}/route/${routePointId}/progress`, {
    actualArrival,
  })
}

export async function deleteTrip(id: string): Promise<void> {
  return apiClient.delete<void>(`/trips/${id}`)
}
