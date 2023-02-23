import { ShipActiveVM } from '../../../ships/classes/view-models/ship-active-vm'

export interface RegistrarReadDto {

    id: number
    ship: ShipActiveVM
    fullname: string
    phones: string
    email: string
    fax: string
    address: string
    isPrimary: boolean
    isActive: boolean

}
