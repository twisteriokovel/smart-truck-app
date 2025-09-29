import type { IAddress } from '@/types/addresses'

export function getAddressDisplayName(address: IAddress): string {
  return `${address.addressLine1}, ${address.city}, ${address.state} ${address.postcode}`
}
