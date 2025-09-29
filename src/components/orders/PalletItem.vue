<template>
  <div
    class="w-full bg-gray-50 p-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
  >
    <div class="flex items-center gap-6">
      <div class="text-sm font-medium text-gray-900 min-w-fit">
        {{ t('orders.pallet') }} {{ index + 1 }}
      </div>

      <div class="flex items-center gap-4 flex-1">
        <UiTextField
          v-model="weightModel"
          :label="t('orders.palletWeight') + ' (kg):'"
          :placeholder="t('orders.enterPalletWeight')"
          :readonly="readonly"
          class="w-48"
          horizontal
        />

        <UiTextField
          v-model="heightModel"
          :label="t('orders.palletHeight') + ' (cm):'"
          :placeholder="t('orders.enterPalletHeight')"
          :readonly="readonly"
          class="w-48"
          horizontal
        />
      </div>

      <div v-if="!readonly" class="flex items-center gap-1">
        <Button
          type="button"
          icon="pi pi-copy"
          severity="info"
          size="small"
          text
          :title="t('common.duplicate')"
          @click="$emit('duplicate')"
        />
        <Button
          type="button"
          icon="pi pi-trash"
          severity="danger"
          size="small"
          text
          :title="t('common.delete')"
          @click="$emit('delete')"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import UiTextField from '@/components/ui/UiTextField.vue'
import type { IPallet } from '@/types/orders'

interface Props {
  pallet: IPallet
  index: number
  readonly?: boolean
}

interface Emits {
  (e: 'update:pallet', pallet: IPallet): void
  (e: 'duplicate'): void
  (e: 'delete'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { t } = useI18n()

const weightModel = computed({
  get: () => props.pallet.weight?.toString() || '',
  set: (value: string) => {
    emit('update:pallet', {
      ...props.pallet,
      weight: parseFloat(value) || 0,
    })
  },
})

const heightModel = computed({
  get: () => props.pallet.height?.toString() || '',
  set: (value: string) => {
    emit('update:pallet', {
      ...props.pallet,
      height: parseFloat(value) || 0,
    })
  },
})
</script>
