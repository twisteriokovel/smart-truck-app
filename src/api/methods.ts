import { apiClient } from './client'
import type { ILoginCredentials, ILoginResponse, IUser } from '@/types/auth'
import type { IAddress, ICreateAddressData } from '@/types/addresses'
import type { ITruck, ICreateTruckData } from '@/types/trucks'
import type { IOrderResponse as IOrder, IOrderFormData } from '@/types/orders'
import type {
  ITrip,
  ICreateTripData,
  IOrderTrip,
  ICreateOrderTripData,
  ICompleteTripData,
} from '@/types/trips'

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

export async function getAllOrders(params?: {
  page?: number
  pageSize?: number
}): Promise<{
  orders: IOrder[]
  total: number
  page: number
  pageSize: number
}> {
  const queryParams = new URLSearchParams()
  if (params?.page) queryParams.append('page', params.page.toString())
  if (params?.pageSize)
    queryParams.append('pageSize', params.pageSize.toString())

  const query = queryParams.toString()
  const url = query ? `/orders?${query}` : '/orders'

  return apiClient.get(url)
}

export async function getOrderById(id: string): Promise<IOrder> {
  return apiClient.get<IOrder>(`/orders/${id}`)
}

export async function createOrder(data: IOrderFormData): Promise<IOrder> {
  return apiClient.post<IOrder>('/orders', data)
}

export async function updateOrder(
  id: string,
  data: Partial<IOrderFormData>,
): Promise<IOrder> {
  return apiClient.put<IOrder>(`/orders/${id}`, data)
}

export async function cancelOrder(id: string): Promise<IOrder> {
  return apiClient.patch<IOrder>(`/orders/${id}/cancel`)
}

export async function getAllTrips(params?: {
  page?: number
  pageSize?: number
}): Promise<{
  trips: ITrip[]
  total: number
  page: number
  pageSize: number
}> {
  const queryParams = new URLSearchParams()
  if (params?.page) queryParams.append('page', params.page.toString())
  if (params?.pageSize)
    queryParams.append('pageSize', params.pageSize.toString())

  const query = queryParams.toString()
  const url = query ? `/trips?${query}` : '/trips'

  return apiClient.get(url)
}

export async function updateTrip(
  id: string,
  data: Partial<ICreateTripData>,
): Promise<IOrderTrip> {
  return apiClient.put<IOrderTrip>(`/trips/${id}`, data)
}

export async function startTrip(id: string): Promise<ITrip> {
  return apiClient.patch<ITrip>(`/trips/${id}/start`)
}

export async function completeTrip(
  id: string,
  { actualFuel, actualDuration }: ICompleteTripData,
): Promise<ITrip> {
  return apiClient.patch<ITrip>(`/trips/${id}/complete`, {
    actualFuel,
    actualDuration,
  })
}

export async function deleteTrip(id: string): Promise<void> {
  return apiClient.delete<void>(`/trips/${id}`)
}

export async function getOrderTrips(orderId: string): Promise<IOrderTrip[]> {
  return apiClient.get<IOrderTrip[]>(`/orders/${orderId}/trips`)
}

export async function createOrderTrip(
  data: ICreateOrderTripData,
): Promise<IOrderTrip> {
  return apiClient.post<IOrderTrip>(`/orders/${data.orderId}/trips`, data)
}

export async function getAvailableTrucksForOrder(
  orderId: string,
): Promise<ITruck[]> {
  return apiClient.get<ITruck[]>(`/orders/${orderId}/available-trucks`)
}
