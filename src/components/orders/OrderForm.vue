<template>
  <form @submit.prevent="handleSubmit">
    <CargoSummary
      :total-weight="totalWeight"
      :total-pallets="formData.pallets.length"
      :readonly="readonly"
      @add-pallet="addPallet"
    />

    <div class="space-y-6">
      <div>
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">
            {{ t('orders.pallets') }}
          </h3>
        </div>

        <div class="grid gap-4">
          <PalletItem
            v-for="(pallet, index) in formData.pallets"
            :key="pallet.id"
            :pallet="pallet"
            :index="index"
            :readonly="readonly"
            @update:pallet="updatePallet(index, $event)"
            @duplicate="duplicatePallet(index)"
            @delete="removePallet(index)"
          />
        </div>

        <div
          v-if="customError"
          class="bg-red-50 border border-red-200 rounded-md p-4 mt-4"
        >
          <div class="flex">
            <div class="flex-shrink-0">
              <i class="pi pi-exclamation-triangle text-red-400"></i>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-800">{{ customError }}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <UiFormField
          :label="t('orders.destination') + ' *'"
          :error-messages="result.destinationAddressId.$messages"
        >
          <Dropdown
            v-model="formData.destinationAddressId"
            :options="addresses"
            option-label="displayName"
            option-value="_id"
            :placeholder="t('orders.selectDestination')"
            :loading="isLoadingAddresses"
            :disabled="readonly"
            class="w-full"
            filter
            :filter-placeholder="t('orders.searchAddresses')"
          />
        </UiFormField>
      </div>

      <div>
        <UiTextField
          v-model="formData.notes"
          :label="t('orders.notes')"
          :placeholder="t('orders.enterNotes')"
          :readonly="readonly"
          multiline
          rows="3"
        />
      </div>

      <div class="flex justify-end gap-3">
        <Button
          type="button"
          :label="t('common.cancel')"
          severity="secondary"
          @click="$emit('cancel')"
        />
        <Button
          v-if="!readonly"
          type="submit"
          :label="isEditMode ? t('common.update') : t('common.create')"
          :loading="isLoading"
        />
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onBeforeMount } from 'vue'
import { useI18n } from 'vue-i18n'
import useValidate from 'vue-tiny-validate'
import { v4 } from 'uuid'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import UiTextField from '@/components/ui/UiTextField.vue'
import UiFormField from '@/components/ui/UiFormField.vue'
import CargoSummary from './CargoSummary.vue'
import PalletItem from './PalletItem.vue'
import { getAllAddresses } from '@/api'
import type { IAddress } from '@/types/addresses'
import type {
  IPallet,
  IOrderFormData,
  IOrderResponse as IOrder,
} from '@/types/orders'
import { getAddressDisplayName } from '@/utils/address'

interface Props {
  order?: IOrder | null
  isLoading?: boolean
  readonly?: boolean
}

interface Emits {
  (e: 'submit', data: IOrderFormData): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  order: null,
  isLoading: false,
  readonly: false,
})

const emit = defineEmits<Emits>()
const { t } = useI18n()

const addresses = ref<IAddress[]>([])
const isLoadingAddresses = ref(false)
const customError = ref('')

const isEditMode = computed(() => !!props.order)

const formData = ref<IOrderFormData>({
  pallets: [],
  destinationAddressId: '',
  notes: '',
})

const validationRules = reactive({
  destinationAddressId: [
    {
      name: 'required',
      test: (value: string) => Boolean(value?.trim()),
      message: t('orders.destinationRequired'),
    },
  ],
})

const { result } = useValidate(formData, validationRules, {
  autoTest: false,
  firstError: true,
})

const totalWeight = computed(() => {
  return formData.value.pallets.reduce(
    (total, pallet) => total + (pallet.weight || 0),
    0,
  )
})

function addPallet() {
  formData.value.pallets.push({
    id: v4(),
    weight: 0,
    height: 0,
  })
}

function updatePallet(index: number, pallet: IPallet) {
  formData.value.pallets[index] = pallet
}

function duplicatePallet(index: number) {
  const originalPallet = formData.value.pallets[index]
  const duplicatedPallet = {
    id: v4(),
    weight: originalPallet.weight,
    height: originalPallet.height,
  }
  formData.value.pallets.splice(index + 1, 0, duplicatedPallet)
}

function removePallet(index: number) {
  formData.value.pallets.splice(index, 1)
}

async function handleSubmit() {
  customError.value = ''
  await result.value.$test()

  if (result.value.$invalid) {
    return
  }

  if (formData.value.pallets.length === 0) {
    customError.value = t('orders.noPalletsError')
    return
  }

  const invalidPallets = formData.value.pallets.filter(
    (pallet) =>
      !pallet.weight ||
      pallet.weight <= 0 ||
      !pallet.height ||
      pallet.height <= 0,
  )

  if (invalidPallets.length > 0) {
    customError.value = t('orders.invalidPalletsError')
    return
  }

  emit('submit', { ...formData.value })
}

async function loadAddresses() {
  isLoadingAddresses.value = true
  try {
    const response = await getAllAddresses()
    addresses.value = response.addresses.map((address) => ({
      ...address,
      displayName: getAddressDisplayName(address),
    }))
  } catch (error) {
    console.error('Failed to load addresses:', error)
  } finally {
    isLoadingAddresses.value = false
  }
}

function initializeFormData() {
  if (props.order) {
    formData.value = {
      pallets: props.order.pallets?.length
        ? props.order.pallets.map((pallet) => ({ ...pallet }))
        : [
            {
              id: v4(),
              weight: props.order.cargoWeight,
              height: 100,
            },
          ],
      destinationAddressId: props.order.destinationAddressId,
      notes: props.order.notes || '',
    }
  }
}

onBeforeMount(async () => {
  await loadAddresses()
  initializeFormData()
})
</script>
