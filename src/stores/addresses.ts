import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { AxiosError } from 'axios'
import {
  getAllAddresses,
  createAddress as apiCreateAddress,
  updateAddress as apiUpdateAddress,
  deleteAddress,
} from '@/api'
import type { IAddress, ICreateAddressData } from '@/types/addresses'
import { useNotification } from '@/composables/useNotification'
import { DEFAULT_PAGE_SIZE } from '@/utils/constants'

export const useAddressesStore = defineStore('addresses', () => {
  const addressesList = ref<IAddress[]>([])
  const isLoading = ref(false)
  const isLoadingAddress = ref(false)
  const isShownFormModal = ref(false)
  const editedAddress = ref<IAddress | null>(null)

  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(DEFAULT_PAGE_SIZE)

  const { t } = useI18n()
  const { error, success } = useNotification()

  async function fetchAddresses() {
    isLoading.value = true

    try {
      const response = await getAllAddresses({
        page: page.value,
        pageSize: pageSize.value,
      })

      addressesList.value = response.addresses
      total.value = response.total
      page.value = response.page
      pageSize.value = response.pageSize
    } catch (err) {
      error(
        (err as AxiosError<{ message: string }>)?.response?.data?.message ||
          t('addresses.failedToSaveAddress'),
      )
    } finally {
      isLoading.value = false
    }
  }

  async function addAddress(data: ICreateAddressData) {
    isLoadingAddress.value = true

    try {
      await apiCreateAddress(data)
      success(t('addresses.addressCreatedSuccessfully'))
      fetchAddresses()
      closeModal()
    } catch (err) {
      error(
        (err as AxiosError<{ message: string }>)?.response?.data?.message ||
          t('addresses.failedToSaveAddress'),
      )
    } finally {
      isLoadingAddress.value = false
    }
  }

  async function editAddress(data: Partial<ICreateAddressData>) {
    if (!editedAddress.value) {
      return
    }
    isLoadingAddress.value = true
    try {
      await apiUpdateAddress(editedAddress.value._id, data)
      success(t('addresses.addressUpdatedSuccessfully'))
      fetchAddresses()
      closeModal()
    } catch (err) {
      error(
        (err as AxiosError<{ message: string }>)?.response?.data?.message ||
          t('addresses.failedToSaveAddress'),
      )
    } finally {
      isLoadingAddress.value = false
    }
  }

  async function removeAddress(id: string) {
    isLoadingAddress.value = true

    try {
      await deleteAddress(id)
      success(t('addresses.addressDeletedSuccessfully'))
      fetchAddresses()
    } catch (err) {
      error(
        (err as AxiosError<{ message: string }>)?.response?.data?.message ||
          t('addresses.failedToDeleteAddress'),
      )
    } finally {
      isLoadingAddress.value = false
    }
  }

  function handleAddressFormSubmit(address: ICreateAddressData) {
    if (editedAddress.value) {
      editAddress(address)
    } else {
      addAddress(address)
    }
  }

  watch([page, pageSize], fetchAddresses, { immediate: true })

  function openAddressModal(address?: IAddress) {
    editedAddress.value = address ?? null
    isShownFormModal.value = true
  }

  function closeModal() {
    isShownFormModal.value = false
    editedAddress.value = null
  }

  return {
    addressesList,
    isLoading,
    isLoadingAddress,
    isShownFormModal,
    editedAddress,
    total,
    page,
    pageSize,
    fetchAddresses,
    addAddress,
    editAddress,
    handleAddressFormSubmit,
    removeAddress,
    openAddressModal,
    closeModal,
  }
})
