import { ShipOwnerActiveVM } from 'src/app/features/shipOwners/classes/view-models/shipOwner-active-vm'

export interface ShipReadDto {

    id: number
    shipOwner: ShipOwnerActiveVM
    description: string
    imo: string
    flag: string
    registryNo: string
    manager: string
    managerInGreece: string
    agent: string
    isActive: boolean

}
