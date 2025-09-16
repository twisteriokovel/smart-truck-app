<template>
  <form class="space-y-4" @submit.prevent="submitForm">
    <div class="grid grid-cols-2 gap-4">
      <UiTextField
        v-model="formData.plateNumber"
        :label="t('trucks.plateNumber')"
        :placeholder="t('trucks.enterPlateNumber')"
        :error-messages="result.plateNumber.$messages"
      />

      <UiTextField
        v-model="formData.vinCode"
        :label="t('trucks.vinCode')"
        :placeholder="t('trucks.enterVinCode')"
        :error-messages="result.vinCode.$messages"
      />
    </div>

    <div class="grid grid-cols-2 gap-4">
      <UiTextField
        v-model="formData.truckModel"
        :label="t('trucks.truckModel')"
        :placeholder="t('trucks.enterTruckModel')"
      />

      <UiTextField
        v-model.number="formData.manufacturingYear"
        :label="t('trucks.manufacturingYear')"
        :placeholder="t('trucks.enterManufacturingYear')"
        type="number"
      />
    </div>

    <UiTextField
      v-model="formData.registrationCertificate"
      :label="t('trucks.registrationCertificate')"
      :placeholder="t('trucks.enterRegistrationCertificate')"
      :error-messages="result.registrationCertificate.$messages"
    />

    <UiTextField
      v-model="formData.driverName"
      :label="t('trucks.driverName')"
      :placeholder="t('trucks.enterDriverName')"
      :error-messages="result.driverName.$messages"
    />

    <div class="grid grid-cols-3 gap-4">
      <UiTextField
        v-model.number="formData.width"
        :label="t('trucks.width')"
        :placeholder="t('trucks.enterWidth')"
        :error-messages="result.width.$messages"
      />

      <UiTextField
        v-model.number="formData.height"
        :label="t('trucks.height')"
        :placeholder="t('trucks.enterHeight')"
        :error-messages="result.height.$messages"
      />

      <UiTextField
        v-model.number="formData.length"
        :label="t('trucks.length')"
        :placeholder="t('trucks.enterLength')"
        :error-messages="result.length.$messages"
      />
    </div>

    <UiTextField
      v-model="formData.maxWeight"
      :label="t('trucks.maxWeight')"
      :placeholder="t('trucks.enterMaxWeight')"
      :error-messages="result.maxWeight.$messages"
    />

    <div class="flex items-center gap-3">
      <label class="text-sm font-medium text-gray-700">
        {{ t('trucks.status') }}
      </label>
      <ToggleSwitch
        v-model="formData.isActive"
        :aria-label="t('trucks.status')"
      />
      <span class="text-sm text-gray-600">
        {{ formData.isActive ? t('trucks.active') : t('trucks.inactive') }}
      </span>
    </div>

    <UiTextField
      v-model="formData.notes"
      :label="t('trucks.notes')"
      :placeholder="t('trucks.enterNotes')"
      multiline
    />

    <div class="flex justify-end gap-2 pt-4">
      <Button
        type="button"
        :label="t('common.cancel')"
        severity="secondary"
        @click="$emit('cancel')"
      />
      <Button
        type="submit"
        :label="editedTruck ? t('common.update') : t('common.create')"
        :loading="isLoadingTruck"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import Button from 'primevue/button'
import ToggleSwitch from 'primevue/toggleswitch'
import useValidate from 'vue-tiny-validate'
import UiTextField from '@/components/ui/UiTextField.vue'
import { useTrucksStore } from '@/stores/trucks'
import type { ICreateTruckData } from '@/types/trucks'
import { VALIDATION_TESTS } from '@/utils/validation'

const emit = defineEmits<{
  (e: 'submit', data: ICreateTruckData): void
  (e: 'cancel'): void
}>()

const { t } = useI18n()
const trucksStore = useTrucksStore()
const { editedTruck, isLoadingTruck } = storeToRefs(trucksStore)

const TRUCK_FORM_DATA: ICreateTruckData = {
  plateNumber: '',
  vinCode: '',
  registrationCertificate: '',
  driverName: '',
  width: '',
  height: '',
  length: '',
  maxWeight: '',
  truckModel: '',
  manufacturingYear: undefined,
  notes: '',
  isActive: true,
}

const formData = ref<ICreateTruckData>({ ...TRUCK_FORM_DATA })

const validationRules = reactive({
  plateNumber: [
    {
      name: 'required',
      test: VALIDATION_TESTS.required,
      message: t('validation.required', { field: t('trucks.plateNumber') }),
    },
  ],
  vinCode: [
    {
      name: 'required',
      test: VALIDATION_TESTS.required,
      message: t('validation.required', { field: t('trucks.vinCode') }),
    },
  ],
  registrationCertificate: [
    {
      name: 'required',
      test: VALIDATION_TESTS.required,
      message: t('validation.required', {
        field: t('trucks.registrationCertificate'),
      }),
    },
  ],
  driverName: [
    {
      name: 'required',
      test: VALIDATION_TESTS.required,
      message: t('validation.required', { field: t('trucks.driverName') }),
    },
  ],
  width: [
    {
      name: 'required',
      test: VALIDATION_TESTS.required,
      message: t('validation.required', { field: t('trucks.width') }),
    },
    {
      name: 'numeric',
      test: VALIDATION_TESTS.numeric,
      message: t('validation.numeric', { field: t('trucks.width') }),
    },
  ],
  height: [
    {
      name: 'required',
      test: VALIDATION_TESTS.required,
      message: t('validation.required', { field: t('trucks.height') }),
    },
    {
      name: 'numeric',
      test: VALIDATION_TESTS.numeric,
      message: t('validation.numeric', { field: t('trucks.height') }),
    },
  ],
  length: [
    {
      name: 'required',
      test: VALIDATION_TESTS.required,
      message: t('validation.required', { field: t('trucks.length') }),
    },
    {
      name: 'numeric',
      test: VALIDATION_TESTS.numeric,
      message: t('validation.numeric', { field: t('trucks.length') }),
    },
  ],
  maxWeight: [
    {
      name: 'required',
      test: VALIDATION_TESTS.required,
      message: t('validation.required', { field: t('trucks.maxWeight') }),
    },
    {
      name: 'numeric',
      test: VALIDATION_TESTS.numeric,
      message: t('validation.numeric', { field: t('trucks.maxWeight') }),
    },
  ],
  truckModel: [],
  manufacturingYear: [],
  notes: [],
})

const { result } = useValidate(formData, validationRules, {
  autoTest: true,
  firstError: true,
})

function resetForm() {
  formData.value = { ...TRUCK_FORM_DATA }
}

function loadEditData() {
  if (!editedTruck.value) {
    resetForm()
    return
  }
  formData.value = {
    plateNumber: editedTruck.value.plateNumber,
    vinCode: editedTruck.value.vinCode,
    registrationCertificate: editedTruck.value.registrationCertificate,
    driverName: editedTruck.value.driverName,
    width: editedTruck.value.width.toString(),
    height: editedTruck.value.height.toString(),
    length: editedTruck.value.length.toString(),
    maxWeight: editedTruck.value.maxWeight.toString(),
    truckModel: editedTruck.value.truckModel || '',
    manufacturingYear: editedTruck.value.manufacturingYear,
    notes: editedTruck.value.notes || '',
    isActive: editedTruck.value.isActive,
  }
}

async function submitForm() {
  await result.value.$test()
  const isInvalid = result.value.$invalid
  if (isInvalid) {
    return
  }

  emit('submit', formData.value)
}

watch(
  () => editedTruck.value,
  () => loadEditData(),
  { deep: true, immediate: true },
)
</script>
