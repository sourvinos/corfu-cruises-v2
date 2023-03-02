import { CoachRouteDropdownVM } from 'src/app/features/coachRoutes/classes/view-models/coachRoute-dropdown-vm'

export interface PickupPointReadDto {

    id: number
    description: string
    coachRoute: CoachRouteDropdownVM
    exactPoint: string
    time: string
    remarks: string
    isActive: boolean

}
