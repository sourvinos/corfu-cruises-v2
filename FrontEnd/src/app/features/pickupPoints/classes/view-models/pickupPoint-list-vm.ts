import { PickupPointListCoachRouteVM } from './pickupPoint-list-coachRoute-vm'

export interface PickupPointListVM {

    id: number
    description: string
    coachRoute: PickupPointListCoachRouteVM
    exactPoint: string
    time: string
    isActive: boolean

}
