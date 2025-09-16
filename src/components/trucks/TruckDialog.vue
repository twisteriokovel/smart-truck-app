<template>
  <Dialog
    v-model:visible="isShownFormModal"
    :header="editedTruck ? t('trucks.editTruck') : t('trucks.createTruck')"
    modal
    class="w-[600px]"
  >
    <TruckForm @submit="handleTruckFormSubmit" @cancel="closeModal" />
  </Dialog>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import Dialog from 'primevue/dialog'
import TruckForm from './TruckForm.vue'
import { useTrucksStore } from '@/stores/trucks'

const { t } = useI18n()
const trucksStore = useTrucksStore()
const { isShownFormModal, editedTruck } = storeToRefs(trucksStore)
const { closeModal, handleTruckFormSubmit } = trucksStore
</script>
