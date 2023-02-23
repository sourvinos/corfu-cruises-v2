import { Guid } from 'guid-typescript'
// Custom
import { CustomerActiveVM } from '../../../customers/classes/view-models/customer-active-vm'

export class UserReadDto {

    id: Guid
    userName: string
    displayname: string
    customer: CustomerActiveVM
    email: string
    isAdmin: boolean
    isActive: boolean

}
