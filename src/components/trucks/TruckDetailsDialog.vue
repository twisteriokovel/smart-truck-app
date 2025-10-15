<template>
  <Dialog
    :visible="!!selectedTruck"
    :header="t('trucks.truckDetails')"
    modal
    class="w-[800px]"
    @update:visible="onVisibilityChange"
  >
    <div v-if="currentTruck" class="space-y-6">
      <div class="border-b pb-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          {{ t('trucks.basicInfo') }}
        </h3>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">
              {{ t('trucks.plateNumber') }}
            </label>
            <p class="mt-1 text-sm text-gray-900">
              {{ currentTruck.plateNumber }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">
              {{ t('trucks.vinCode') }}
            </label>
            <p class="mt-1 text-sm text-gray-900">
              {{ currentTruck.vinCode }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">
              {{ t('trucks.truckModel') }}
            </label>
            <p class="mt-1 text-sm text-gray-900">
              {{ currentTruck.truckModel || t('common.notSpecified') }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">
              {{ t('trucks.manufacturingYear') }}
            </label>
            <p class="mt-1 text-sm text-gray-900">
              {{ currentTruck.manufacturingYear || t('common.notSpecified') }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">
              {{ t('trucks.driverName') }}
            </label>
            <p class="mt-1 text-sm text-gray-900">
              {{ currentTruck.driverName }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">
              {{ t('trucks.status') }}
            </label>
            <div class="mt-1">
              <Tag
                :value="
                  currentTruck.isActive
                    ? t('trucks.active')
                    : t('trucks.inactive')
                "
                :severity="currentTruck.isActive ? 'success' : 'danger'"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="border-b pb-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          {{ t('trucks.registrationInfo') }}
        </h3>
        <div>
          <label class="block text-sm font-medium text-gray-700">
            {{ t('trucks.registrationCertificate') }}
          </label>
          <p class="mt-1 text-sm text-gray-900">
            {{ currentTruck.registrationCertificate }}
          </p>
        </div>
      </div>

      <div class="border-b pb-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          {{ t('trucks.specifications') }}
        </h3>
        <div class="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">
              {{ t('trucks.length') }}
            </label>
            <p class="mt-1 text-sm text-gray-900">{{ currentTruck.length }}m</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">
              {{ t('trucks.width') }}
            </label>
            <p class="mt-1 text-sm text-gray-900">{{ currentTruck.width }}m</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">
              {{ t('trucks.height') }}
            </label>
            <p class="mt-1 text-sm text-gray-900">{{ currentTruck.height }}m</p>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">
              {{ t('trucks.maxWeight') }}
            </label>
            <p class="mt-1 text-sm text-gray-900">
              {{ formatWeight(currentTruck.maxWeight, isWeightInTonnes) }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">
              {{ t('trucks.maxPallets') }}
            </label>
            <p class="mt-1 text-sm text-gray-900">
              {{ currentTruck.maxPallets }}
            </p>
          </div>
        </div>
      </div>

      <div v-if="currentTruck.notes">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          {{ t('trucks.additionalInfo') }}
        </h3>
        <div>
          <label class="block text-sm font-medium text-gray-700">
            {{ t('trucks.notes') }}
          </label>
          <p class="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
            {{ currentTruck.notes }}
          </p>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2 pt-4">
        <Button type="button" :label="t('common.edit')" @click="editTruck" />
        <Button
          :label="t('common.close')"
          severity="secondary"
          @click="closeDetailsModal"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import { useTrucksStore } from '@/stores/trucks'
import { formatWeight } from '@/utils/functions'

const { t } = useI18n()
const trucksStore = useTrucksStore()
const { selectedTruck, isWeightInTonnes } = storeToRefs(trucksStore)
const { closeDetailsModal, openTruckModal } = trucksStore

const currentTruck = ref<typeof selectedTruck.value>(null)

watch(
  selectedTruck,
  (newTruck) => {
    currentTruck.value = newTruck
  },
  { immediate: true },
)

function onVisibilityChange(visible: boolean) {
  if (!visible) {
    closeDetailsModal()
  }
}

function editTruck() {
  if (currentTruck.value) {
    const truckToEdit = currentTruck.value
    closeDetailsModal()
    openTruckModal(truckToEdit)
  }
}
</script>
