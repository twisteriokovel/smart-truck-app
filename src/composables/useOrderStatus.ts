import { useI18n } from 'vue-i18n'
import { OrderStatus } from '@/types/orders'

export interface IOrderStatusConfig {
  value: string
  severity: string
}

export function useOrderStatus() {
  const { t } = useI18n()

  function getStatusConfig(status: OrderStatus): IOrderStatusConfig {
    const statusMap = {
      [OrderStatus.DRAFT]: {
        value: t('orders.statusDraft'),
        severity: 'secondary',
      },
      [OrderStatus.NEW]: {
        value: t('orders.statusNew'),
        severity: 'info',
      },
      [OrderStatus.IN_PROGRESS]: {
        value: t('orders.statusInProgress'),
        severity: 'warning',
      },
      [OrderStatus.DONE]: {
        value: t('orders.statusDone'),
        severity: 'success',
      },
      [OrderStatus.CANCELLED]: {
        value: t('orders.statusCancelled'),
        severity: 'danger',
      },
    }

    return statusMap[status] || { value: status, severity: 'secondary' }
  }

  return {
    getStatusConfig,
  }
}
