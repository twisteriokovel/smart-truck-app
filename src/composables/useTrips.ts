import { useI18n } from 'vue-i18n'
import { useConfirm } from 'primevue/useconfirm'
import { useTripsStore } from '@/stores/trips'
import { TripStatus, type IOrderTrip } from '@/types/trips'
import { storeToRefs } from 'pinia'

export function useTrips() {
  const confirm = useConfirm()
  const { t } = useI18n()

  const tripsStore = useTripsStore()
  const { editedTrip } = storeToRefs(tripsStore)
  const { startTrip, deleteTrip } = tripsStore

  function getTripStatusLabel(status: TripStatus): string {
    const statusMap = {
      [TripStatus.PLANNED]: t('trips.status.planned'),
      [TripStatus.IN_PROGRESS]: t('trips.status.inProgress'),
      [TripStatus.DONE]: t('trips.status.done'),
      [TripStatus.CANCELLED]: t('trips.status.cancelled'),
    }
    return statusMap[status] || status
  }

  function getTripStatusSeverity(status: TripStatus): string {
    const severityMap = {
      [TripStatus.PLANNED]: 'warn',
      [TripStatus.IN_PROGRESS]: 'info',
      [TripStatus.DONE]: 'success',
      [TripStatus.CANCELLED]: 'danger',
    }
    return severityMap[status] || 'info'
  }

  function confirmStartTrip(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      confirm.require({
        message: t('trips.confirmStartTripMessage'),
        header: t('trips.start'),
        icon: 'pi pi-exclamation-triangle',
        rejectProps: {
          label: t('common.cancel'),
          severity: 'secondary',
          outlined: true,
        },
        acceptProps: {
          label: t('trips.start'),
          severity: 'success',
        },
        accept: async () => {
          try {
            await startTrip(id)
            resolve(true)
          } catch {
            resolve(false)
          }
        },
        reject: () => {
          resolve(false)
        },
      })
    })
  }

  function confirmDeleteTrip(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      confirm.require({
        message: t('trips.confirmDeleteTripMessage'),
        header: t('trips.deleteTrip'),
        icon: 'pi pi-exclamation-triangle',
        rejectProps: {
          label: t('common.cancel'),
          severity: 'secondary',
          outlined: true,
        },
        acceptProps: {
          label: t('common.delete'),
          severity: 'danger',
        },
        accept: async () => {
          try {
            await deleteTrip(id)
            resolve(true)
          } catch {
            resolve(false)
          }
        },
        reject: () => {
          resolve(false)
        },
      })
    })
  }

  function editTrip(trip: IOrderTrip) {
    editedTrip.value = trip
  }

  return {
    confirmStartTrip,
    confirmDeleteTrip,
    getTripStatusLabel,
    getTripStatusSeverity,
    editTrip,
  }
}
