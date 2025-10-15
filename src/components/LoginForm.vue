<template>
  <form class="space-y-6" @submit.prevent="handleSubmit">
    <div class="space-y-4">
      <UiTextField
        v-model="formData.email"
        :label="$t('auth.email')"
        :placeholder="$t('auth.emailPlaceholder')"
        :error-messages="result.email.$messages"
      />

      <UiPasswordField
        v-model="formData.password"
        :label="$t('auth.password')"
        :placeholder="$t('auth.passwordPlaceholder')"
        :error-messages="result.password.$messages"
      />
    </div>

    <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <i class="pi pi-exclamation-triangle text-red-400"></i>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-800">{{ error }}</p>
        </div>
      </div>
    </div>

    <div>
      <Button
        type="submit"
        :label="$t('auth.login')"
        class="w-full"
        :loading="isLoading"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import useValidate from 'vue-tiny-validate'
import Button from 'primevue/button'
import UiTextField from '@/components/ui/UiTextField.vue'
import UiPasswordField from '@/components/ui/UiPasswordField.vue'
import { useAuthStore } from '@/stores/auth'
import type { ILoginCredentials } from '@/types/auth'
import { storeToRefs } from 'pinia'

const { t } = useI18n()
const authStore = useAuthStore()
const { isLoading } = storeToRefs(authStore)

defineProps<{
  error?: string
}>()

const emit = defineEmits<{
  submit: [credentials: ILoginCredentials]
}>()

const formData = ref<ILoginCredentials>({
  email: '',
  password: '',
})

const validationRules = reactive({
  email: [
    {
      name: 'required',
      test: (value: string) => Boolean(value?.trim()),
      message: t('auth.emailRequired'),
    },
    {
      name: 'email',
      test: (value: string) => /\S+@\S+\.\S+/.test(value),
      message: t('auth.invalidEmail'),
    },
  ],
  password: [
    {
      name: 'required',
      test: (value: string) => Boolean(value?.trim()),
      message: t('auth.passwordRequired'),
    },
    {
      name: 'minLength',
      test: (value: string) => value?.length >= 6,
      message: t('auth.passwordMinLength'),
    },
  ],
})

const { result } = useValidate(formData, validationRules, {
  autoTest: false,
  firstError: true,
})

async function handleSubmit() {
  await result.value.$test()
  const isInvalid = result.value.$invalid
  if (isInvalid) {
    return
  }
  emit('submit', formData.value)
}
</script>
