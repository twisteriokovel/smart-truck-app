import type { IMenuItem } from '@/types/sidebar'

export const DEFAULT_PAGE_SIZE = 5

export const MENU_ITEMS: IMenuItem[] = [
  {
    name: 'dashboard',
    path: '/',
    label: 'Dashboard',
    icon: 'pi pi-home',
  },
  {
    name: 'addresses',
    path: '/addresses',
    label: 'Addresses',
    icon: 'pi pi-map-marker',
  },
  {
    name: 'trucks',
    path: '/trucks',
    label: 'Trucks',
    icon: 'pi pi-car',
  },
  {
    name: 'orders',
    path: '/orders',
    label: 'Orders',
    icon: 'pi pi-shopping-cart',
  },
  {
    name: 'trips',
    path: '/trips',
    label: 'Trips',
    icon: 'pi pi-map',
  },
]
