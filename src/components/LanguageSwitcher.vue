<template>
  <Select
    v-model="currentLocale"
    :options="localeOptions"
    option-label="label"
    option-value="value"
    class="w-32"
    @change="handleLanguageChange"
  >
    <template #value="{ value }">
      <div v-if="value" class="flex items-center">
        <span>{{ getLanguageLabel(value) }}</span>
      </div>
    </template>
    <template #option="{ option }">
      <div class="flex items-center">
        <span>{{ option.label }}</span>
      </div>
    </template>
  </Select>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Select from 'primevue/select'

interface ILocaleOption {
  label: string
  value: string
}

const { t, locale } = useI18n()
const currentLocale = ref(locale.value)

const availableLocales = ['en', 'ua']

const localeOptions = computed((): ILocaleOption[] => {
  return availableLocales.map((localeValue) => ({
    label: t(`languages.${localeValue}`),
    value: localeValue,
  }))
})

function getLanguageLabel(localeValue: string): string {
  return t(`languages.${localeValue}`)
}

function handleLanguageChange(event: { value: string }): void {
  const newLocale = event.value
  locale.value = newLocale
  currentLocale.value = newLocale
}

onMounted(() => {
  currentLocale.value = locale.value
})
</script>
