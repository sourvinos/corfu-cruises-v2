import { Guid } from 'guid-typescript'

export interface UpdateUserDto {

    id: Guid
    userName: string
    displayname: string
    customerId?: number
    email: string
    isAdmin: boolean
    isActive: boolean

}
