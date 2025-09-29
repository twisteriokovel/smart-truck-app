import { useI18n } from 'vue-i18n'

export function useDateFormat() {
  const { locale } = useI18n()

  function formatDate(date: Date | string): string {
    if (!date) return ''

    const dateObj = typeof date === 'string' ? new Date(date) : date

    return dateObj.toLocaleDateString(locale.value, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  function formatDateTime(date: Date | string): string {
    if (!date) return ''

    const dateObj = typeof date === 'string' ? new Date(date) : date

    return dateObj.toLocaleString(locale.value, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  function formatTime(date: Date | string): string {
    if (!date) return ''

    const dateObj = typeof date === 'string' ? new Date(date) : date

    return dateObj.toLocaleTimeString(locale.value, {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  function formatDateLong(date: Date | string): string {
    if (!date) return ''

    const dateObj = typeof date === 'string' ? new Date(date) : date

    return dateObj.toLocaleDateString(locale.value, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  function formatDateTimeRelative(date: Date | string): string {
    if (!date) return ''

    const dateObj = typeof date === 'string' ? new Date(date) : date
    const now = new Date()
    const diffMs = now.getTime() - dateObj.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return formatTime(dateObj)
    } else if (diffDays === 1) {
      return 'Yesterday'
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else {
      return formatDate(dateObj)
    }
  }

  function isToday(date: Date | string): boolean {
    if (!date) return false

    const dateObj = typeof date === 'string' ? new Date(date) : date
    const today = new Date()

    return (
      dateObj.getDate() === today.getDate() &&
      dateObj.getMonth() === today.getMonth() &&
      dateObj.getFullYear() === today.getFullYear()
    )
  }

  function isYesterday(date: Date | string): boolean {
    if (!date) return false

    const dateObj = typeof date === 'string' ? new Date(date) : date
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    return (
      dateObj.getDate() === yesterday.getDate() &&
      dateObj.getMonth() === yesterday.getMonth() &&
      dateObj.getFullYear() === yesterday.getFullYear()
    )
  }

  return {
    formatDate,
    formatDateTime,
    formatTime,
    formatDateLong,
    formatDateTimeRelative,
    isToday,
    isYesterday,
  }
}
