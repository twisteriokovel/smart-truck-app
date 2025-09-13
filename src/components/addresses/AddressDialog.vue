<template>
  <Dialog
    v-model:visible="isShownFormModal"
    :header="
      editedAddress ? t('addresses.editAddress') : t('addresses.createAddress')
    "
    modal
    class="w-[600px]"
  >
    <AddressForm @submit="handleAddressFormSubmit" @cancel="closeModal" />
  </Dialog>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import Dialog from 'primevue/dialog'
import AddressForm from './AddressForm.vue'
import { useAddressesStore } from '@/stores/addresses'

const { t } = useI18n()
const addressesStore = useAddressesStore()
const { isShownFormModal, editedAddress } = storeToRefs(addressesStore)
const { closeModal, handleAddressFormSubmit } = addressesStore
</script>
