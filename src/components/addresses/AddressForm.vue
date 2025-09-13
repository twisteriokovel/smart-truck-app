<template>
  <form class="space-y-4" @submit.prevent="submitForm">
    <UiTextField
      v-model="formData.addressLine1"
      :label="t('addresses.addressLine1')"
      :placeholder="t('addresses.enterAddressLine1')"
      :error-messages="result.addressLine1.$messages"
    />

    <div class="grid grid-cols-2 gap-4">
      <UiTextField
        v-model="formData.city"
        :label="t('addresses.city')"
        :placeholder="t('addresses.enterCity')"
        :error-messages="result.city.$messages"
      />

      <UiTextField
        v-model="formData.state"
        :label="t('addresses.state')"
        :placeholder="t('addresses.enterState')"
        :error-messages="result.state.$messages"
      />
    </div>

    <div class="grid grid-cols-2 gap-4">
      <UiTextField
        v-model="formData.postcode"
        :label="t('addresses.postcode')"
        :placeholder="t('addresses.enterPostcode')"
        :error-messages="result.postcode.$messages"
      />

      <UiTextField
        v-model="formData.country"
        :label="t('addresses.country')"
        :placeholder="t('addresses.enterCountry')"
        :error-messages="result.country.$messages"
      />
    </div>

    <div class="flex justify-end gap-2 pt-4">
      <Button
        type="button"
        :label="t('common.cancel')"
        severity="secondary"
        @click="$emit('cancel')"
      />
      <Button
        type="submit"
        :label="editedAddress ? t('common.update') : t('common.create')"
        :loading="isLoadingAddress"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import Button from 'primevue/button'
import useValidate from 'vue-tiny-validate'
import UiTextField from '@/components/ui/UiTextField.vue'
import { useAddressesStore } from '@/stores/addresses'
import type { ICreateAddressData } from '@/types/addresses'

const emit = defineEmits<{
  (e: 'submit', data: ICreateAddressData): void
  (e: 'cancel'): void
}>()

const { t } = useI18n()
const addressesStore = useAddressesStore()
const { editedAddress, isLoadingAddress } = storeToRefs(addressesStore)

const ADDRESS_FORM_DATA = {
  addressLine1: '',
  city: '',
  state: '',
  postcode: '',
  country: '',
}

const formData = ref<ICreateAddressData>({
  addressLine1: '',
  city: '',
  state: '',
  postcode: '',
  country: '',
})

const validationRules = reactive({
  addressLine1: [
    {
      name: 'required',
      test: (value: string) => Boolean(value?.trim()),
      message: t('validation.required', { field: t('addresses.addressLine1') }),
    },
  ],
  city: [
    {
      name: 'required',
      test: (value: string) => Boolean(value?.trim()),
      message: t('validation.required', { field: t('addresses.city') }),
    },
  ],
  state: [
    {
      name: 'required',
      test: (value: string) => Boolean(value?.trim()),
      message: t('validation.required', { field: t('addresses.state') }),
    },
  ],
  postcode: [
    {
      name: 'required',
      test: (value: string) => Boolean(value?.trim()),
      message: t('validation.required', { field: t('addresses.postcode') }),
    },
  ],
  country: [
    {
      name: 'required',
      test: (value: string) => Boolean(value?.trim()),
      message: t('validation.required', { field: t('addresses.country') }),
    },
  ],
})

const { result } = useValidate(formData, validationRules, {
  autoTest: true,
  firstError: true,
})

function resetForm() {
  formData.value = { ...ADDRESS_FORM_DATA }
}

function loadEditData() {
  if (!editedAddress.value) {
    resetForm()
    return
  }
  formData.value = {
    addressLine1: editedAddress.value.addressLine1,
    city: editedAddress.value.city,
    state: editedAddress.value.state,
    postcode: editedAddress.value.postcode,
    country: editedAddress.value.country,
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
  () => editedAddress.value,
  () => loadEditData(),
  { deep: true, immediate: true },
)
</script>
