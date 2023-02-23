import { EmbarkationVM } from './embarkation-vm'

export interface EmbarkationGroupVM {

    totalPersons: number
    embarkedPassengers: number
    pendingPersons: number

    reservations: EmbarkationVM[]

}
