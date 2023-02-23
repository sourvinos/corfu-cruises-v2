import { PortActiveVM } from 'src/app/features/ports/classes/view-models/port-active-vm'

export interface CoachRouteReadDto {

    id: number
    port: PortActiveVM
    abbreviation: string
    description: string
    hasTransfer: boolean
    isActive: boolean

}
