export interface IAddress {
  _id: string
  addressLine1: string
  addressLine2?: string
  city: string
  country: string
  postcode: string
  state: string
}

export interface ICreateAddressData {
  addressLine1: string
  addressLine2?: string
  city: string
  country: string
  postcode: string
  state: string
}
