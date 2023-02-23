export interface UserNewDto {

    userName: string
    displayname: string
    customerId?: number
    email: string
    password: string
    confirmPassword: string
    isAdmin: boolean
    isActive: boolean

}
