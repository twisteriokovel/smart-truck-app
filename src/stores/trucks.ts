import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { AxiosError } from 'axios'
import {
  getAllTrucks,
  createTruck as apiCreateTruck,
  updateTruck as apiUpdateTruck,
  deleteTruck,
} from '@/api'
import type { ITruck, ICreateTruckData } from '@/types/trucks'
import { useNotification } from '@/composables/useNotification'
import { DEFAULT_PAGE_SIZE } from '@/utils/constants'

export const useTrucksStore = defineStore('trucks', () => {
  const trucksList = ref<ITruck[]>([])
  const isLoading = ref(false)
  const isLoadingTruck = ref(false)
  const isShownFormModal = ref(false)
  const editedTruck = ref<ITruck | null>(null)
  const selectedTruck = ref<ITruck | null>(null)
  const isWeightInTonnes = ref(false)

  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(DEFAULT_PAGE_SIZE)

  const { t } = useI18n()
  const { error, success } = useNotification()

  async function fetchTrucks() {
    isLoading.value = true

    try {
      const response = await getAllTrucks({
        page: page.value,
        pageSize: pageSize.value,
      })

      trucksList.value = response.trucks
      total.value = response.total
      page.value = response.page
      pageSize.value = response.pageSize
    } catch (err) {
      error(
        (err as AxiosError<{ message: string }>)?.response?.data?.message ||
          t('trucks.failedToSaveTruck'),
      )
    } finally {
      isLoading.value = false
    }
  }

  async function addTruck(data: ICreateTruckData) {
    isLoadingTruck.value = true
    try {
      await apiCreateTruck(data)
      success(t('trucks.truckCreatedSuccessfully'))
      fetchTrucks()
      closeModal()
    } catch (err) {
      error(
        (err as AxiosError<{ message: string }>)?.response?.data?.message ||
          t('trucks.failedToSaveTruck'),
      )
    } finally {
      isLoadingTruck.value = false
    }
  }

  async function editTruck(data: Partial<ICreateTruckData>) {
    if (!editedTruck.value) {
      return
    }
    isLoadingTruck.value = true
    try {
      await apiUpdateTruck(editedTruck.value._id, data)
      success(t('trucks.truckUpdatedSuccessfully'))
      fetchTrucks()
      closeModal()
    } catch (err) {
      error(
        (err as AxiosError<{ message: string }>)?.response?.data?.message ||
          t('trucks.failedToSaveTruck'),
      )
    } finally {
      isLoadingTruck.value = false
    }
  }

  async function removeTruck(id: string) {
    isLoadingTruck.value = true
    try {
      await deleteTruck(id)
      success(t('trucks.truckDeletedSuccessfully'))
      fetchTrucks()
    } catch (err) {
      error(
        (err as AxiosError<{ message: string }>)?.response?.data?.message ||
          t('trucks.failedToDeleteTruck'),
      )
    } finally {
      isLoadingTruck.value = false
    }
  }

  function handleTruckFormSubmit(truck: ICreateTruckData) {
    if (editedTruck.value) {
      editTruck(truck)
    } else {
      addTruck(truck)
    }
  }

  watch([page, pageSize], fetchTrucks, { immediate: true })

  function openTruckModal(truck?: ITruck) {
    editedTruck.value = truck ?? null
    isShownFormModal.value = true
  }

  function closeModal() {
    isShownFormModal.value = false
    editedTruck.value = null
  }

  function openDetailsModal(truck: ITruck) {
    selectedTruck.value = truck
  }

  function closeDetailsModal() {
    selectedTruck.value = null
  }

  function $reset() {
    trucksList.value = []
    total.value = 0
    page.value = 1
    pageSize.value = DEFAULT_PAGE_SIZE
  }

  return {
    trucksList,
    isLoading,
    isLoadingTruck,
    isShownFormModal,
    editedTruck,
    selectedTruck,
    isWeightInTonnes,
    total,
    page,
    pageSize,
    fetchTrucks,
    addTruck,
    editTruck,
    handleTruckFormSubmit,
    removeTruck,
    openTruckModal,
    closeModal,
    openDetailsModal,
    closeDetailsModal,
    $reset,
  }
})
