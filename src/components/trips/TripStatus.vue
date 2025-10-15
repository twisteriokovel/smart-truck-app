<template>
  <Tag
    :value="getTripStatusLabel(trip.status)"
    :severity="getTripStatusSeverity(trip.status)"
  />
</template>

<script setup lang="ts">
import Tag from 'primevue/tag'
import { useTrips } from '@/composables/useTrips'
import { type IOrderTrip } from '@/types/trips'

const { getTripStatusLabel, getTripStatusSeverity } = useTrips()

defineProps<{
  trip: IOrderTrip
}>()
</script>
