import { CoachRouteActiveVM } from '../../../coachRoutes/classes/view-models/coachRoute-active-vm'

export interface PickupPointReadDto {

    id: number
    description: string
    coachRoute: CoachRouteActiveVM
    exactPoint: string
    time: string
    coordinates: string
    isActive: boolean

}
