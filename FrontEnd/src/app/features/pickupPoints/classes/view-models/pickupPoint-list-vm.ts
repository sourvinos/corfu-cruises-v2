import { SimpleEntity } from 'src/app/shared/classes/simple-entity'

export interface PickupPointListVM {

    id: number
    description: string
    coachRoute: SimpleEntity
    exactPoint: string
    time: string
    isActive: boolean

}
