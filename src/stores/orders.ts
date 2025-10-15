import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { AxiosError } from 'axios'
import {
  getAllOrders,
  createOrder as apiCreateOrder,
  updateOrder as apiUpdateOrder,
  cancelOrder as apiCancelOrder,
} from '@/api'
import type { IOrderResponse as IOrder, IOrderFormData } from '@/types/orders'
import { useNotification } from '@/composables/useNotification'
import { DEFAULT_PAGE_SIZE } from '@/utils/constants'

export const useOrdersStore = defineStore('orders', () => {
  const ordersList = ref<IOrder[]>([])
  const isLoading = ref(false)
  const isLoadingOrder = ref(false)

  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(DEFAULT_PAGE_SIZE)

  const { t } = useI18n()
  const { error, success } = useNotification()

  async function fetchOrders() {
    isLoading.value = true

    try {
      const response = await getAllOrders({
        page: page.value,
        pageSize: pageSize.value,
      })

      ordersList.value = response.orders
      total.value = response.total
      page.value = response.page
      pageSize.value = response.pageSize
    } catch (err) {
      const message =
        (err as AxiosError<{ message: string }>)?.response?.data?.message ||
        t('orders.failedToLoadOrders')
      error(message)
    } finally {
      isLoading.value = false
    }
  }

  async function createOrder(data: IOrderFormData) {
    isLoadingOrder.value = true
    try {
      const { _id: id } = await apiCreateOrder(data)
      success(t('orders.orderCreatedSuccessfully'))
      return id
    } catch (err) {
      const message =
        (err as AxiosError<{ message: string }>)?.response?.data?.message ||
        t('orders.failedToSaveOrder')
      error(message)
    } finally {
      isLoadingOrder.value = false
    }
  }

  async function editOrder(orderId: string, data: IOrderFormData) {
    isLoadingOrder.value = true
    try {
      await apiUpdateOrder(orderId, data)
      success(t('orders.orderUpdatedSuccessfully'))
      fetchOrders()
    } catch (err) {
      const message =
        (err as AxiosError<{ message: string }>)?.response?.data?.message ||
        t('orders.failedToSaveOrder')
      error(message)
    } finally {
      isLoadingOrder.value = false
    }
  }

  async function cancelOrder(orderId: string) {
    try {
      await apiCancelOrder(orderId)
      success(t('orders.orderCancelledSuccessfully'))
      fetchOrders()
    } catch (err) {
      const message =
        (err as AxiosError<{ message: string }>)?.response?.data?.message ||
        t('orders.failedToCancelOrder')
      error(message)
      throw err
    }
  }

  watch([page, pageSize], fetchOrders, { immediate: true })

  return {
    ordersList,
    isLoading,
    isLoadingOrder,
    total,
    page,
    pageSize,
    fetchOrders,
    createOrder,
    editOrder,
    cancelOrder,
  }
})
