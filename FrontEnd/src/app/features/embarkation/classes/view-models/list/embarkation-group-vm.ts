import { EmbarkationReservationVM } from './embarkation-reservation-vm'

export interface EmbarkationGroupVM {

    totalPax: number
    embarkedPassengers: number
    pendingPax: number

    reservations: EmbarkationReservationVM[]

}
