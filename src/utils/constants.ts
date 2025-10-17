import type { IMenuItem } from '@/types/sidebar'

export const DEFAULT_PAGE_SIZE = 10

export const MENU_ITEMS: IMenuItem[] = [
  {
    name: 'dashboard',
    path: '/',
    label: 'Dashboard',
    translationKey: 'sidebar.dashboard',
    icon: 'pi pi-home',
  },
  {
    name: 'addresses',
    path: '/addresses',
    label: 'Addresses',
    translationKey: 'sidebar.addresses',
    icon: 'pi pi-map-marker',
  },
  {
    name: 'trucks',
    path: '/trucks',
    label: 'Trucks',
    translationKey: 'sidebar.trucks',
    icon: 'pi pi-car',
  },
  {
    name: 'orders',
    path: '/orders',
    label: 'Orders',
    translationKey: 'sidebar.orders',
    icon: 'pi pi-shopping-cart',
  },
  {
    name: 'trips',
    path: '/trips',
    label: 'Trips',
    translationKey: 'sidebar.trips',
    icon: 'pi pi-map',
  },
]
