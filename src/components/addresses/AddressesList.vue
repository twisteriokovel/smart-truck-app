<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">
        {{ t('addresses.title') }}
      </h1>
      <Button @click="openAddressModal()">
        {{ t('addresses.addAddress') }}
      </Button>
    </div>

    <div class="bg-white rounded-lg shadow">
      <DataTable
        :value="addressesList"
        :loading="isLoading"
        :rows="pageSize"
        :total-records="total"
        :rows-per-page-options="[5, 10, 25]"
        paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        paginator
        lazy
        responsive-layout="scroll"
        @page="page = ++$event.page"
      >
        <template #empty>
          <div class="text-center py-4">
            <p class="text-gray-500">{{ t('addresses.noAddressesFound') }}</p>
          </div>
        </template>

        <Column field="city" :header="t('addresses.city')" sortable></Column>
        <Column field="state" :header="t('addresses.state')" sortable></Column>
        <Column :header="t('addresses.address')" sortable>
          <template #body="slotProps">
            {{ slotProps.data.addressLine1 }}
            <span v-if="slotProps.data.addressLine2">
              , {{ slotProps.data.addressLine2 }}
            </span>
          </template>
        </Column>
        <Column
          field="postcode"
          :header="t('addresses.postcode')"
          sortable
        ></Column>
        <Column :header="t('common.actions')">
          <template #body="slotProps">
            <div class="flex gap-2">
              <Button
                icon="pi pi-pencil"
                severity="info"
                size="small"
                text
                @click="openAddressModal(slotProps.data)"
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
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { useConfirm } from 'primevue/useconfirm'
import { useAddressesStore } from '@/stores/addresses'
import type { IAddress } from '@/types/addresses'

const confirm = useConfirm()
const { t } = useI18n()
const addressesStore = useAddressesStore()
const { addressesList, isLoading, page, pageSize, total } =
  storeToRefs(addressesStore)
const { openAddressModal, removeAddress } = addressesStore

function confirmDelete(address: IAddress) {
  confirm.require({
    message: t('addresses.confirmDeleteMessage'),
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
    accept: () => removeAddress(address._id),
  })
}
</script>
