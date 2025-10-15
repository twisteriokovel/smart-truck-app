<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">
        {{ t('trucks.title') }}
      </h1>
      <div class="flex items-center gap-4">
        <Button @click="openTruckModal()">
          {{ t('trucks.addTruck') }}
        </Button>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow">
      <DataTable
        :value="trucksList"
        :loading="isLoading"
        :rows="pageSize"
        :total-records="total"
        :rows-per-page-options="[5, 10, 25]"
        paginator-template="FirstPa0geLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        paginator
        lazy
        responsive-layout="scroll"
        selection-mode="single"
        class="cursor-pointer"
        @page="page = ++$event.page"
        @row-select="onRowSelect"
      >
        <template #empty>
          <div class="text-center py-4">
            <p class="text-gray-500">{{ t('trucks.noTrucksFound') }}</p>
          </div>
        </template>
        <template #header>
          <div class="flex justify-end items-center">
            <div class="flex items-center gap-3">
              <span class="text-sm text-gray-700">
                {{ t('trucks.changeWeightUnit') }}:
              </span>
              <div class="flex items-center gap-2 text-sm">
                <span
                  :class="{ 'font-semibold text-blue-600': !isWeightInTonnes }"
                >
                  kg
                </span>
                <ToggleSwitch v-model="isWeightInTonnes" class="scale-75" />
                <span
                  :class="{ 'font-semibold text-blue-600': isWeightInTonnes }"
                >
                  {{ t('trucks.tonnes') }}
                </span>
              </div>
            </div>
          </div>
        </template>

        <Column field="plateNumber" :header="t('trucks.plateNumber')" />
        <Column field="driverName" :header="t('trucks.driverName')" />
        <Column field="truckModel" :header="t('trucks.truckModel')" />
        <Column :header="t('trucks.dimensions')">
          <template #body="slotProps">
            {{ slotProps.data.length }}×{{ slotProps.data.width }}×{{
              slotProps.data.height
            }}m
          </template>
        </Column>
        <Column field="maxWeight" :header="formattedWeightHeader">
          <template #body="slotProps">
            {{ getFormattedWeight(slotProps.data.maxWeight) }}
          </template>
        </Column>
        <Column field="maxPallets" :header="t('trucks.maxPallets')" />
        <Column :header="t('trucks.status')">
          <template #body="slotProps">
            <Tag
              :value="
                slotProps.data.isActive
                  ? t('trucks.active')
                  : t('trucks.inactive')
              "
              :severity="slotProps.data.isActive ? 'success' : 'danger'"
            />
          </template>
        </Column>
        <Column :header="t('common.actions')">
          <template #body="slotProps">
            <div class="flex gap-2">
              <Button
                icon="pi pi-pencil"
                severity="info"
                size="small"
                text
                @click="openTruckModal(slotProps.data)"
              />
              <Button
                icon="pi pi-trash"
                severity="danger"
                size="small"
                text
                @click="confirmDelete(slotProps.data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import ToggleSwitch from 'primevue/toggleswitch'
import { useConfirm } from 'primevue/useconfirm'
import { useTrucksStore } from '@/stores/trucks'
import type { ITruck } from '@/types/trucks'
import { formatWeight } from '@/utils/functions'

const confirm = useConfirm()
const { t } = useI18n()
const trucksStore = useTrucksStore()
const { trucksList, isLoading, page, pageSize, total, isWeightInTonnes } =
  storeToRefs(trucksStore)
const { openTruckModal, removeTruck, openDetailsModal } = trucksStore

function getFormattedWeight(weight: number | string): string {
  return formatWeight(weight, isWeightInTonnes.value)
}

const formattedWeightHeader = computed(() => {
  return `${t('trucks.maxWeight')} ${
    isWeightInTonnes.value ? `(${t('trucks.tonnes')})` : `(${t('trucks.kg')})`
  }`
})

function onRowSelect(event: { data: ITruck }) {
  openDetailsModal(event.data)
}

function confirmDelete(truck: ITruck) {
  confirm.require({
    message: t('trucks.confirmDeleteMessage'),
    header: t('common.confirmation'),
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: t('common.cancel'),
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: t('common.confirm'),
    },
    accept: () => removeTruck(truck._id),
  })
}
</script>
