<template>
  <div class="flex gap-2">
    <Button
      v-if="trip.status === TripStatus.PLANNED"
      v-tooltip.top="t('common.edit')"
      icon="pi pi-pencil"
      severity="info"
      size="small"
      text
      @click.stop="editTrip(trip)"
    />

    <template v-if="!disabledStatusButtons">
      <Button
        v-if="trip.status === TripStatus.PLANNED && trip.palletIds.length !== 0"
        v-tooltip.top="t('trips.start')"
        icon="pi pi-play"
        severity="success"
        size="small"
        text
        @click.stop="handleTripStart"
      />

      <Button
        v-if="trip.status === TripStatus.IN_PROGRESS"
        v-tooltip.top="t('trips.complete')"
        icon="pi pi-check"
        severity="info"
        size="small"
        text
        @click.stop="showCompleteModal = true"
      />
    </template>
    <Button
      v-if="trip.status === TripStatus.PLANNED"
      v-tooltip.top="t('common.delete')"
      icon="pi pi-trash"
      severity="danger"
      size="small"
      text
      @click.stop="handleTripDelete"
    />
    <TripCompleteModal
      v-model:visible="showCompleteModal"
      :trip="trip"
      @trip-completed="$emit('trip-changed')"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import TripCompleteModal from './TripCompleteModal.vue'
import { useTrips } from '@/composables/useTrips'
import { type IOrderTrip, TripStatus } from '@/types/trips'

const props = defineProps<{
  trip: IOrderTrip
  disabledStatusButtons?: boolean
}>()

const emit = defineEmits<{
  (e: 'trip-changed'): void
}>()

const { t } = useI18n()

const showCompleteModal = ref(false)

const { confirmDeleteTrip, confirmStartTrip, editTrip } = useTrips()

async function handleTripDelete() {
  const isDeleted = await confirmDeleteTrip(props.trip._id)
  if (isDeleted) {
    emit('trip-changed')
  }
}

async function handleTripStart() {
  const isStarted = await confirmStartTrip(props.trip._id)
  if (isStarted) {
    emit('trip-changed')
  }
}
</script>
