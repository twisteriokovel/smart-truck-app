<template>
  <Dialog
    v-model:visible="visible"
    modal
    :header="t('trips.completeTrip')"
    :style="{ width: '400px' }"
    class="trip-complete-modal"
    @hide="handleClose"
  >
    <form @submit.prevent="handleSubmit">
      <div class="space-y-4">
        <div class="mb-4 text-gray-600">
          <p>{{ t('trips.completeTripDescription') }}</p>
        </div>

        <UiTextField
          v-model="formData.actualFuel"
          :label="t('trips.actualFuel') + ' (L) *'"
          :placeholder="t('trips.enterActualFuel')"
          :error-messages="result.actualFuel.$messages"
        />

        <UiTextField
          v-model="formData.actualDuration"
          :label="t('trips.actualDuration') + ' (h) *'"
          :placeholder="t('trips.enterActualDuration')"
          :error-messages="result.actualDuration.$messages"
        />

        <UiFormField :label="t('trips.notes')">
          <Textarea
            v-model="formData.notes"
            :placeholder="t('trips.enterNotes')"
            rows="3"
            class="w-full"
          />
        </UiFormField>
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
          :label="t('trips.completeTrip')"
          :loading="isLoadingTripOperation"
        />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Textarea from 'primevue/textarea'
import UiFormField from '@/components/ui/UiFormField.vue'
import UiTextField from '@/components/ui/UiTextField.vue'
import useValidate from 'vue-tiny-validate'
import { useTripsStore } from '@/stores/trips'
import type { IOrderTrip } from '@/types/trips'

const INITIAL_FORM_DATA = {
  actualFuel: '',
  actualDuration: '',
  notes: '',
}

const props = defineProps<{
  trip: IOrderTrip | null
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'trip-completed'): void
}>()

const tripsStore = useTripsStore()
const { isLoadingTripOperation } = storeToRefs(tripsStore)
const { completeTrip } = tripsStore

const { t } = useI18n()
const visible = defineModel<boolean>('visible', { default: false })

const formData = ref(INITIAL_FORM_DATA)

const validationRules = reactive({
  actualFuel: [
    {
      name: 'required',
      test: (value: number | null) => value !== null && value > 0,
      message: t('validation.required', { field: t('trips.actualFuel') }),
    },
    {
      name: 'min',
      test: (value: number | null) => value === null || value >= 0,
      message: t('validation.minValue', {
        field: t('trips.actualFuel'),
        min: 0,
      }),
    },
  ],
  actualDuration: [
    {
      name: 'required',
      test: (value: number | null) => value !== null && value > 0,
      message: t('validation.required', { field: t('trips.actualDuration') }),
    },
    {
      name: 'min',
      test: (value: number | null) => value === null || value >= 0,
      message: t('validation.minValue', {
        field: t('trips.actualDuration'),
        min: 0,
      }),
    },
  ],
})

const { result } = useValidate(formData, validationRules, {
  autoTest: true,
  firstError: true,
})

function resetForm() {
  formData.value = { ...INITIAL_FORM_DATA }
  result.value.$reset()
}

function handleClose() {
  emit('update:visible', false)
  resetForm()
}

async function handleSubmit() {
  await result.value.$test()
  const isInvalid = result.value.$invalid
  if (isInvalid || !props.trip) {
    return
  }
  await completeTrip(props.trip?._id, formData.value)
  emit('trip-completed')
  handleClose()
}
</script>
