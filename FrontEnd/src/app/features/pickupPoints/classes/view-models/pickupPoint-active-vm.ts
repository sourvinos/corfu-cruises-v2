import { PortActiveVM } from 'src/app/features/ports/classes/view-models/port-active-vm'


export interface PickupPointActiveVM {

    id: number
    description: string
    exactPoint: string
    time: string
    port: PortActiveVM

}
