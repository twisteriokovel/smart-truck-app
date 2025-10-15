import { useToast } from 'primevue/usetoast'

export function useNotification() {
  const toast = useToast()

  function success(message: string, detail?: string) {
    toast.add({
      severity: 'success',
      summary: message,
      detail,
      life: 3000,
    })
  }

  function error(message: string, detail?: string) {
    toast.add({
      severity: 'error',
      summary: message,
      detail,
      life: 5000,
    })
  }

  function info(message: string, detail?: string) {
    toast.add({
      severity: 'info',
      summary: message,
      detail,
      life: 3000,
    })
  }

  function warning(message: string, detail?: string) {
    toast.add({
      severity: 'warn',
      summary: message,
      detail,
      life: 4000,
    })
  }

  return {
    success,
    error,
    info,
    warning,
  }
}
