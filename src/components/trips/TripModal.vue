<template>
  <Dialog
    v-model:visible="visible"
    modal
    :header="Boolean(editedTrip) ? t('trips.editTrip') : t('trips.createTrip')"
    :style="{ width: '500px' }"
    class="trip-modal"
    @hide="handleClose"
  >
    <form @submit.prevent="handleSubmit">
      <div class="space-y-4">
        <UiFormField
          :label="t('trips.selectTruck') + ' *'"
          :error-messages="result.truckId.$messages"
        >
          <Select
            v-model="formData.truckId"
            :options="trucksList"
            option-label="plateNumber"
            option-value="_id"
            :placeholder="t('trips.selectTruck')"
            :filter-placeholder="t('trips.searchTrucks')"
            class="w-full"
            filter
          >
            <template #option="{ option: truck }">
              <div class="flex justify-between items-center w-full">
                <div>
                  <div class="font-medium">{{ truck.plateNumber }}</div>
                </div>
                <div class="text-right text-sm text-gray-500">
                  {{ truck.maxPallets }} pallets
                </div>
              </div>
            </template>
          </Select>
        </UiFormField>

        <UiFormField
          :label="t('trips.startDate') + ' *'"
          :error-messages="result.startDate.$messages"
        >
          <DatePicker
            v-model="formData.startDate"
            :placeholder="t('trips.selectStartDate')"
            date-format="dd/mm/yy"
            :min-date="new Date()"
            show-time
            hour-format="24"
            class="w-full"
          />
        </UiFormField>

        <UiTextField
          v-model="formData.estimatedFuel"
          :label="t('trips.estimatedFuel') + ' (L) *'"
          :placeholder="t('trips.enterEstimatedFuel')"
          type="number"
          step="0.01"
          min="0"
          :error-messages="result.estimatedFuel.$messages"
        />

        <UiTextField
          v-model="formData.estimatedDuration"
          :label="t('trips.estimatedDuration') + ' (h) *'"
          :placeholder="t('trips.enterEstimatedDuration')"
          type="number"
          step="0.1"
          min="0"
          :error-messages="result.estimatedDuration.$messages"
        />

        <UiFormField :label="t('trips.notes')">
          <Textarea
            v-model="formData.notes"
            :placeholder="t('trips.enterNotes')"
            rows="3"
            class="w-full"
          />
        </UiFormField>

        <div v-if="selectedTruck" class="bg-gray-50 rounded-lg p-4">
          <h5 class="font-medium text-gray-900 mb-2">
            {{ t('trips.truckCapacity') }}
          </h5>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-600">{{ t('trips.maxWeight') }}:</span>
              <span class="ml-1 font-medium">
                {{ selectedTruck.maxWeight }}kg
              </span>
            </div>
            <div>
              <span class="text-gray-600">{{ t('trips.maxPallets') }}:</span>
              <span class="ml-1 font-medium">
                {{ selectedTruck.maxPallets }}
              </span>
            </div>
            <div>
              <span class="text-gray-600">{{ t('trips.dimensions') }}:</span>
              <span class="ml-1 font-medium">
                {{ selectedTruck.length }}×{{ selectedTruck.width }}×{{
                  selectedTruck.height
                }}cm
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-3 mt-6">
        <Button
          type="button"
          :label="t('common.cancel')"
          severity="secondary"
          @click="handleClose"
        />
        <Button
          type="submit"
          :label="Boolean(editedTrip) ? t('common.update') : t('common.create')"
          :loading="isLoadingTripOperation"
        />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import useValidate from 'vue-tiny-validate'
import { storeToRefs } from 'pinia'
import Button from 'primevue/button'
import Select from 'primevue/select'
import DatePicker from 'primevue/datepicker'
import Textarea from 'primevue/textarea'
import Dialog from 'primevue/dialog'
import UiFormField from '@/components/ui/UiFormField.vue'
import UiTextField from '@/components/ui/UiTextField.vue'
import { useTripsStore } from '@/stores/trips'
import type { IOrderResponse as IOrder } from '@/types/orders'
import type { ICreateOrderTripData, IOrderTrip } from '@/types/trips'
import type { ITruck } from '@/types/trucks'

interface Props {
  availableTrucks: ITruck[]
  order: IOrder | null
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'trip-updated', trip: IOrderTrip): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { t } = useI18n()

const tripsStore = useTripsStore()
const { isLoadingTripOperation, editedTrip } = storeToRefs(tripsStore)
const { createTrip, updateTrip, fetchOrderTrips } = tripsStore

const visible = defineModel<boolean>('visible', { default: false })

const INITIAL_FORM_DATA = {
  orderId: props.order?._id || '',
  truckId: '',
  startDate: new Date(),
  palletIds: [],
  estimatedFuel: '',
  estimatedDuration: '',
  notes: '',
}

const formData = ref<ICreateOrderTripData>(INITIAL_FORM_DATA)

const validationRules = reactive({
  truckId: [
    {
      name: 'required',
      test: (value: string) => Boolean(value?.trim()),
      message: t('trips.truckRequired'),
    },
  ],
  startDate: [
    {
      name: 'required',
      test: (value: Date) => Boolean(value),
      message: t('trips.startDateRequired'),
    },
  ],
  estimatedFuel: [
    {
      name: 'required',
      test: (value: string) => {
        return (
          Boolean(value?.trim()) &&
          !isNaN(parseFloat(value)) &&
          parseFloat(value) > 0
        )
      },
      message: t('trips.estimatedFuelRequired'),
    },
  ],
  estimatedDuration: [
    {
      name: 'required',
      test: (value: string) => {
        return (
          Boolean(value?.trim()) &&
          !isNaN(parseFloat(value)) &&
          parseFloat(value) > 0
        )
      },
      message: t('trips.estimatedDurationRequired'),
    },
  ],
})

const { result } = useValidate(formData, validationRules, {
  autoTest: false,
  firstError: true,
})

const trucksList = computed(() => {
  return [
    ...props.availableTrucks,
    ...(editedTrip.value?.truck ? [editedTrip.value.truck] : []),
  ]
})

const selectedTruck = computed(() => {
  return trucksList.value.find((truck) => truck._id === formData.value.truckId)
})

function handleClose() {
  editedTrip.value = null
  resetForm()
  emit('update:visible', false)
}

function resetForm() {
  formData.value = { ...INITIAL_FORM_DATA }
}

function initializeForm() {
  if (editedTrip.value) {
    formData.value = {
      orderId: props.order?._id || '',
      truckId: editedTrip.value.truck._id,
      startDate: editedTrip.value.startDate,
      palletIds: editedTrip.value.palletIds,
      estimatedFuel: String(editedTrip.value.estimatedFuel),
      estimatedDuration: String(editedTrip.value.estimatedDuration),
      notes: '',
    }
  } else if (props.order) {
    formData.value.orderId = props.order._id
  }
}

async function handleSubmit() {
  await result.value.$test()

  if (result.value.$invalid) {
    return
  }

  try {
    if (editedTrip.value) {
      const updatedTrip = await updateTrip(editedTrip.value._id, {
        ...formData.value,
      })
      emit('trip-updated', updatedTrip)
    } else {
      await createTrip({ ...formData.value })
    }

    if (formData.value.orderId) {
      await fetchOrderTrips(formData.value.orderId)
    }

    handleClose()
  } catch (error) {
    console.error('Failed to create trip:', error)
  }
}

watch(
  () => visible.value,
  (val) => {
    if (val) {
      initializeForm()
    }
  },
  { immediate: true },
)
</script>
