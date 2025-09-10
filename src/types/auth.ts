export interface ILoginCredentials {
  email: string
  password: string
}

export interface ILoginResponse {
  access_token: string
  user: IUser
}

export interface IUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
}
