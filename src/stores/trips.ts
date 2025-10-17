import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { AxiosError } from 'axios'
import {
  getAllTrips,
  startTrip as apiStartTrip,
  completeTrip as apiCompleteTrip,
  deleteTrip as apiDeleteTrip,
  getOrderTrips,
  createOrderTrip as apiCreateTrip,
  updateTrip as apiUpdateTrip,
  getAvailableTrucksForOrder,
} from '@/api'
import type {
  ITrip,
  IOrderTrip,
  ICreateOrderTripData,
  IUpdateOrderTripData,
  ICompleteTripData,
} from '@/types/trips'
import type { ITruck } from '@/types/trucks'
import { useNotification } from '@/composables/useNotification'
import { DEFAULT_PAGE_SIZE } from '@/utils/constants'

export const useTripsStore = defineStore('trips', () => {
  const trips = ref<ITrip[]>([])
  const orderTrips = ref<IOrderTrip[]>([])
  const editedTrip = ref<IOrderTrip | null>(null)

  const isLoadingTrips = ref(false)
  const isLoadingTripOperation = ref(false)
  const availableTrucks = ref<ITruck[]>([])
  const isLoadingTrucks = ref(false)

  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(DEFAULT_PAGE_SIZE)

  const { t } = useI18n()
  const { error, success } = useNotification()

  async function fetchOrderTrips(orderId: string) {
    isLoadingTrips.value = true
    try {
      orderTrips.value = await getOrderTrips(orderId)
    } catch (err) {
      const message =
        (err as AxiosError<{ message: string }>)?.response?.data?.message ||
        t('trips.failedToLoadTrips')
      error(message)
      orderTrips.value = []
    } finally {
      isLoadingTrips.value = false
    }
  }

  async function createTrip(data: ICreateOrderTripData) {
    isLoadingTripOperation.value = true
    try {
      const newTrip = await apiCreateTrip(data)
      orderTrips.value.push(newTrip)
      success(t('trips.tripCreatedSuccessfully'))
      return newTrip
    } catch (err) {
      const message =
        (err as AxiosError<{ message: string }>)?.response?.data?.message ||
        t('trips.failedToCreateTrip')
      error(message)
      throw err
    } finally {
      isLoadingTripOperation.value = false
    }
  }

  async function updateTrip(tripId: string, data: IUpdateOrderTripData) {
    isLoadingTripOperation.value = true
    try {
      const result = await apiUpdateTrip(tripId, data)
      success(t('trips.tripUpdatedSuccessfully'))
      return result
    } catch (err) {
      const message =
        (err as AxiosError<{ message: string }>)?.response?.data?.message ||
        t('trips.failedToUpdateTrip')
      error(message)
      throw err
    } finally {
      isLoadingTripOperation.value = false
    }
  }

  async function fetchAvailableTrucksForOrder(orderId: string) {
    isLoadingTrucks.value = true
    try {
      availableTrucks.value = await getAvailableTrucksForOrder(orderId)
    } catch (err) {
      const message =
        (err as AxiosError<{ message: string }>)?.response?.data?.message ||
        t('trips.failedToLoadAvailableTrucks')
      error(message)
      availableTrucks.value = []
    } finally {
      isLoadingTrucks.value = false
    }
  }

  async function fetchAllTrips() {
    isLoadingTrips.value = true
    try {
      const response = await getAllTrips({
        page: page.value,
        pageSize: pageSize.value,
      })

      trips.value = response.trips
      total.value = response.total
    } catch (err) {
      const message =
        (err as AxiosError<{ message: string }>)?.response?.data?.message ||
        t('trips.failedToLoadTrips')
      error(message)
      trips.value = []
    } finally {
      isLoadingTrips.value = false
    }
  }

  async function startTrip(tripId: string) {
    isLoadingTripOperation.value = true
    try {
      const updatedTrip = await apiStartTrip(tripId)
      success(t('trips.tripStartedSuccessfully'))
      fetchAllTrips()
      return updatedTrip
    } catch (err) {
      const message =
        (err as AxiosError<{ message: string }>)?.response?.data?.message ||
        t('trips.failedToStartTrip')
      error(message)
      throw err
    } finally {
      isLoadingTripOperation.value = false
    }
  }

  async function completeTrip(tripId: string, formData: ICompleteTripData) {
    isLoadingTripOperation.value = true
    try {
      await apiCompleteTrip(tripId, formData)
      success(t('trips.tripCompletedSuccessfully'))
      fetchAllTrips()
    } catch (err) {
      const message =
        (err as AxiosError<{ message: string }>)?.response?.data?.message ||
        t('trips.failedToCompleteTrip')
      error(message)
      throw err
    } finally {
      isLoadingTripOperation.value = false
    }
  }

  async function deleteTrip(tripId: string) {
    isLoadingTripOperation.value = true
    try {
      await apiDeleteTrip(tripId)
      success(t('trips.tripDeletedSuccessfully'))
      return true
    } catch (err) {
      const message =
        (err as AxiosError<{ message: string }>)?.response?.data?.message ||
        t('trips.failedToDeleteTrip')
      error(message)
      throw err
    } finally {
      isLoadingTripOperation.value = false
    }
  }

  watch([page, pageSize], fetchAllTrips, { immediate: true })

  function $reset() {
    trips.value = []
    orderTrips.value = []
    availableTrucks.value = []
    total.value = 0
    page.value = 1
    pageSize.value = DEFAULT_PAGE_SIZE
  }

  return {
    trips,
    editedTrip,
    orderTrips,
    isLoadingTrips,
    isLoadingTripOperation,
    availableTrucks,
    isLoadingTrucks,
    total,
    page,
    pageSize,
    fetchAllTrips,
    fetchOrderTrips,
    createTrip,
    updateTrip,
    startTrip,
    completeTrip,
    deleteTrip,
    fetchAvailableTrucksForOrder,
    $reset,
  }
})
